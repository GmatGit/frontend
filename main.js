import './node_modules/bootstrap/dist/css/bootstrap.css'

async function ListasBetoltes(){
  const tabla = document.getElementById('tabla')
  const ujSorTemp = document.getElementById('ujSorTemp')
  tabla.textContent = ""

  const rez = await fetch('http://localhost:3000/users')
  const tartalom = await rez.json()
  for (let user of tartalom){
    const ujSor = ujSorTemp.content.cloneNode(true)
    ujSor.querySelector('.id').textContent = user.id
    ujSor.querySelector('.email').textContent = user.email
    ujSor.querySelector('.age').textContent = user.age
    ujSor.querySelector('.profile').querySelector('img').src = `http://localhost:3000/users/${user.id}/profile`
    ujSor.querySelector('#torles').addEventListener('click', async () => {
      const rez = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'DELETE',
      })
      ListasBetoltes()
    })
    tabla.appendChild(ujSor)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hozzaad').addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const kor = parseInt(document.getElementById('kor').value)
    const adatKuldesre = {
      email,
      age: kor
    }
    try {
      const rez = await fetch('http://localhost:3000/users', {
          method: 'POST',
          body: JSON.stringify(adatKuldesre),
          headers: {
              'Content-type': 'application/json',
              Accept: 'application/json'
          }
      })
      if (rez.status === 400 || rez.status === 422) {
        const errorData = await rez.json()
        document.getElementById('hozzaadJelento').textContent = `Hiba: ${errorData.message || 'Ismeretlen'}`
      } else if (rez.ok) {
          document.getElementById('hozzaadJelento').textContent = "Felhasználó hozzáadva"
          ListasBetoltes()
      } else {
          const errorData = await rez.json()
          document.getElementById('hozzaadJelento').textContent = `Váratlan hiba: ${errorData.message || 'Ismeretlen'}`
      }
    } catch (error) {
        document.getElementById('hozzaadJelento').textContent = `Probléma a Fetch requesttel! Hiba: ${error.message}`
    }
  })

  document.getElementById('modosit').addEventListener('submit', async e => {
    e.preventDefault()
    const userID = document.getElementById('userID').value
    const email = document.getElementById('emailM').value
    const kor = parseInt(document.getElementById('korM').value)
    const adatKuldesre = {}
    if (email !== '') {
        adatKuldesre.email = email
    }
    if (!isNaN(kor)) {
        adatKuldesre.age = kor
    }

    if (Object.keys(adatKuldesre).length > 0) {
      try {
          const rez = await fetch(`http://localhost:3000/users/${userID}`, {
              method: 'PATCH',
              body: JSON.stringify(adatKuldesre),
              headers: {
                  'Content-type': 'application/json',
                  Accept: 'application/json'
              }
          })

          if (rez.status === 404) {
            const errorData = await rez.json()
            document.getElementById('modositJelento').textContent = `Nincs ilyen user! Hiba: ${errorData.message || 'Ismeretlen hiba'}`
          } else if (rez.ok) {
              document.getElementById('modositJelento').textContent = "Felhasználó módosítva. Ha kész vagy, frissíts az oldalra!"
          } else {
              const errorData = await rez.json()
              document.getElementById('modositJelento').textContent = `Váratlan hiba: ${errorData.message || 'Ismeretlen hiba'}`
          }
      } catch (error) {
          document.getElementById('modositJelento').textContent = `Probléma a Fetch requesttel! Hiba: ${error.message}`
      }
    } else {
      document.getElementById('modositJelento').textContent = "Tölts ki legalább egy mezőt az ID mellett!"
    }
  })

  ListasBetoltes()
})