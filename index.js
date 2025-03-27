require('dotenv').config();
const express = require('express');
const session = require("express-session");
const path = require('path');
const fs = require('fs').promises; // Using asynchronus API for file read and write
const bcrypt = require('bcrypt');
const db = require('./database/db.js')

const app = express();
const PORT = 3000;

app.use(session({
  secret: 'tajna sifra',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));

// Enable JSON parsing without body-parser
app.use(express.json());

/* ---------------- SERVING HTML -------------------- */

// Async function for serving html files
async function serveHTMLFile(req, res, fileName) {
  console.log('Current folder:', __dirname);
  const htmlPath = path.join(__dirname, 'public', 'html', fileName);
  try {
    const content = await fs.readFile(htmlPath, 'utf-8');
    res.send(content);
  } catch (error) {
    console.error('Error serving HTML file:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
}

// Array of HTML files and their routes
const routes = [
  { route: '/nekretnine.html', file: 'nekretnine.html' },
  { route: '/detalji.html', file: 'detalji.html' },
  { route: '/meni.html', file: 'meni.html' },
  { route: '/prijava.html', file: 'prijava.html' },
  { route: '/profil.html', file: 'profil.html' },
  { route: '/mojiUpiti.html', file: 'mojiUpiti.html' },
  // Practical for adding more .html files as the project grows
];

// Loop through the array so HTML can be served
routes.forEach(({ route, file }) => {
  app.get(route, async (req, res) => {
    await serveHTMLFile(req, res, file);
  });
});

/* ----------- SERVING OTHER ROUTES --------------- */

// Async function for reading json data from data folder 
async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

// Async function for reading json data from data folder 
async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}

/*
Checks if the user exists and if the password is correct based on korisnici.json data. 
If the data is correct, the username is saved in the session and a success message is sent.
*/

const loginAttempts = {};

app.post('/login', async (req, res) => {
  const jsonObj = req.body;
  const datetime = new Date().toISOString();
  try {
    if (loginAttempts[jsonObj.username] && loginAttempts[jsonObj.username].blockedUntil > Date.now()) {
      await fs.appendFile(path.join(__dirname, 'prijave.txt'),
              `[${datetime}] - username: ${jsonObj.username} - status: neuspješno\n`);
      return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.' });
    }

    else if (loginAttempts[jsonObj.username] && loginAttempts[jsonObj.username].blockedUntil) {
      loginAttempts[jsonObj.username] = { attempts: 0, blockedUntil: null };
    }
    db.korisnik.findOne({ where: { username: jsonObj.username } }).then((korisnik) => {
      if (korisnik) {

        bcrypt.compare(jsonObj.password, korisnik.password, (err, result) => {
          if (result) {
            req.session.username = korisnik.username;
            
            delete loginAttempts[jsonObj.username];

            fs.appendFile(path.join(__dirname, 'prijave.txt'),
              `[${datetime}] - username: ${jsonObj.username} - status: uspješno\n`);

            
            res.json({ poruka: 'Uspješna prijava' });
          } else {
            if (!loginAttempts[jsonObj.username]) {
              loginAttempts[jsonObj.username] = { attempts: 0, blockedUntil: null };
            }
      
            loginAttempts[jsonObj.username].attempts += 1;
      
            fs.appendFile(path.join(__dirname, 'prijave.txt'),
              `[${datetime}] - username: ${jsonObj.username} - status: neuspješno\n`);

            if (loginAttempts[jsonObj.username].attempts >= 3) {
              loginAttempts[jsonObj.username].blockedUntil = Date.now() + 60000;
              return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.' });
            }

            res.json({ poruka: 'Neuspješna prijava' });
          }
        });
      } else {
        if (!loginAttempts[jsonObj.username]) {
          loginAttempts[jsonObj.username] = { attempts: 0, blockedUntil: null };
        }
  
        loginAttempts[jsonObj.username].attempts += 1;
  
        fs.appendFile(path.join(__dirname, 'prijave.txt'),
          `[${datetime}] - username: ${jsonObj.username} - status: neuspješno\n`);

        if (loginAttempts[jsonObj.username].attempts >= 3) {
          loginAttempts[jsonObj.username].blockedUntil = Date.now() + 60000;
          return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.' });
        }

        res.json({ poruka: 'Neuspješna prijava' });
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Delete everything from the session.
*/
app.post('/logout', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Clear all information from the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ greska: 'Internal Server Error' });
    } else {
      res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
    }
  });
});

/*
Returns currently logged user data. First takes the username from the session and grabs other data
from the .json file.
*/
app.get('/korisnik', async (req, res) => {
  // Check if the username is present in the session
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // User is logged in, fetch additional user data
  const username = req.session.username;

  try {

    const user = await db.korisnik.findOne({ where: { username: username } });

    if (!user) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Send user data
    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
      password: user.password // Should exclude the password for security reasons
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Allows logged user to make a request for a property
*/

app.post('/upit', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { nekretnina_id, tekst_upita } = req.body;

  try {
    
    const loggedInUser = await db.korisnik.findOne({ where: { username: req.session.username } });

    const nekretnina = await db.nekretnina.findOne({ where: { id: nekretnina_id } });

    if (!nekretnina) {
      // Property not found
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
    }

    const upiti = await db.upit.findAll({ 
      where: { 
        korisnikId: loggedInUser.id,
        nekretninaId: nekretnina_id
      } 
    });

    if (upiti.length >= 3) {
      return res.status(429).json({ greska: 'Previse upita za istu nekretninu.' });
    }

    db.upit.create({
      tekst: tekst_upita,
      korisnikId: loggedInUser.id,
      nekretninaId: nekretnina_id
    });

    res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Updates any user field
*/
app.put('/korisnik', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { ime, prezime, username, password } = req.body;

  try {

    const loggedInUser = await db.korisnik.findOne({ where: { username: req.session.username } });

    if (!loggedInUser) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Update user data with the provided values
    if (ime) loggedInUser.ime = ime;
    if (prezime) loggedInUser.prezime = prezime;
    if (username) loggedInUser.username = username;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      loggedInUser.password = hashedPassword;
    }

    loggedInUser.save();
    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Returns all properties from the file.
*/
app.get('/nekretnine', async (req, res) => {
  try {

    const nekretnineData = await db.nekretnina.findAll();
    res.json(nekretnineData);
  } catch (error) {
    console.error('Error fetching properties data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/nekretnine/top5', async (req, res) => {
  const lokacija = req.query.lokacija;
  try {

    const filtriraneNekretnine = await db.nekretnina.findAll(
      {
        where: { lokacija: lokacija },
        order: [['datum_objave', 'DESC']],
        limit: 5
      }
    );

    res.status(200).json(filtriraneNekretnine);
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/upiti/moji', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try {
    const loggedInUser = await db.korisnik.findOne({ where: { username: req.session.username } });
    
    const upiti = await db.upit.findAll({ where: { korisnikId: loggedInUser.id } });
    
    if (upiti.length === 0) {
      return res.status(404).json([]);
    }

    const upitiData = upiti.map(upit => ({
      id_nekretnine: upit.nekretninaId,
      tekst_upita: upit.tekst
    }));

    res.status(200).json(upitiData);
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

app.get('/nekretnina/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const nekretnina = await db.nekretnina.findOne({ where: { id: id } });

    if (!nekretnina) {
      return res.status(404).json({ greska: 'Nekretnina nije pronadjena' });
    }

    const upiti = await db.upit.findAll({ 
      where: { 
      nekretninaId: id 
      },
      attributes: [
      'id',
      ['tekst', 'tekst_upita'],
      ['korisnikId', 'korisnik_id'],
      ['nekretninaId', 'nekretnina_id'],
      'createdAt'
      ],
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    nekretnina.dataValues.upiti = upiti;

    res.status(200).json(nekretnina);
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/next/upiti/nekretnina/:id', async (req, res) => {
  const { id } = req.params;
  const stranica = parseInt(req.query.page);

  try {
    if (stranica < 0) {
      return res.status(404).json([]);
    }

    sliceStart = 3 * (1 + stranica);
    sliceEnd = 3 * (stranica);

    let upiti = [];
    if (!sliceEnd) {
      upiti = await db.upit.findAll({ 
        where: { 
          nekretninaId: id 
        } ,
        order: [['createdAt', 'DESC']],
        limit: sliceStart
      });
    }
    else {
      upiti = await db.upit.findAll({ 
        where: { 
          nekretninaId: id 
        } ,
        order: [['createdAt', 'DESC']],
        offset: sliceEnd,
        limit: sliceStart
      });
    }

    if (upiti.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(upiti);
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/nekretnina/:id/interesovanja', async (req, res) => {
  const { id } = req.params;

  try {
    let korisnik = null;
    if (req.session.username) {
      korisnik = await db.korisnik.findOne({ where: { username: req.session.username } });
    }

    const interesovanja = await db.nekretnina.getInteresovanja(id);

    if(!interesovanja) {
      return res.status(404).json({ greska: 'Interesovanja nisu pronadjena' });
    }

    let interesovanjaData = [];

    if(!korisnik) {
      interesovanjaData = interesovanja.map((interesovanje) => {
        const { cijenaPonude, ...rest } = interesovanje.dataValues;
        rest.vidljivost = false;
        return rest;
      });
    }

    else if(!korisnik.admin) {
      interesovanjaData = await Promise.all(interesovanja.map(async (interesovanje) => {
        const rest = { ...interesovanje.dataValues };
        rest.vidljivost = true;
        if (interesovanje.korisnikId != korisnik.id) {
          rest.vidljivost = false;
        }
        if ('cijenaPonude' in rest && rest.korisnikId !== korisnik.id) {
          const vezanePonude = await interesovanje.vezanePonude;
          
          let postojiPonudaKorisnika = false;

          if (vezanePonude) {
            postojiPonudaKorisnika = vezanePonude.some(ponuda => {

              if(ponuda && ponuda.korisnikId === korisnik.id) {
                return true;
              }

            });
          }
          if (!postojiPonudaKorisnika) {
            delete rest.cijenaPonude;
          }
          else {
            rest.vidljivost = true;
          }
        }
        return rest;
      }));
      
    }

    else {
      interesovanjaData = interesovanja.map(interesovanje => {
        const rest = { ...interesovanje.dataValues, vidljivost: true };
        return rest;
      });
    }

    res.status(200).json(interesovanjaData);
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

app.post('/nekretnina/:id/ponuda', async (req, res) => {

  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { id } = req.params;

  const {tekst, ponudaCijene, datumPonude, idVezanePonude, odbijenaPonuda} = req.body;

  try {
    const nekretnina = await db.nekretnina.findOne({ where: { id: id } });

    if (!nekretnina) {
        return res.status(404).json({ error: 'Nekretnina nije pronađena' });
    }

    const korisnik = await db.korisnik.findOne({ where: { username: req.session.username } });

    //TODO: Implementacija kreiranja ponude
    let vezanaPonuda = null;
    if (idVezanePonude) {
        vezanaPonuda = await db.ponuda.findOne({ where: { id: idVezanePonude } });

        if (!vezanaPonuda) {
          return res.status(404).json({ error: 'Početna ponuda nije pronađena' });
        }

        const vezanePonude = await vezanaPonuda.vezanePonude;

        const postojiOdbijenaPonuda = vezanaPonuda.odbijenaPonuda || vezanePonude.some(ponuda => {
          return ponuda.odbijenaPonuda
        }
        );
        if (postojiOdbijenaPonuda) {
            return res.status(400).json({ error: 'Postoji odbijena ponuda.' });
        }

        const daLiJeAdmin = korisnik.admin
        const daLiJeVlasnikPonude = vezanaPonuda.korisnikId === korisnik.id;

        if(!daLiJeAdmin && !daLiJeVlasnikPonude) {
          const vlasnikNekePonude = vezanePonude.some(ponuda => ponuda.korisnikId === korisnik.id);
          if(!vlasnikNekePonude) {
            return res.status(403).json({ error: 'Neautorizovan pristup.' });
          }
        }

        let korijenskiId  = vezanaPonuda.id;
        if(vezanaPonuda.korijenskiId) {
          const korijenskaPonuda = await db.ponuda.findOne({where: {id: vezanaPonuda.korijenskiId}});
          korijenskiId = korijenskaPonuda.id;
        }

        db.ponuda.create({
          tekst: tekst,
          datumPonude: datumPonude,
          odbijenaPonuda: odbijenaPonuda,
          nekretninaId: id,
          korisnikId: korisnik.id,
          cijenaPonude: ponudaCijene,
          korijenskiId: korijenskiId
        });
    }

    else {
      db.ponuda.create({
        tekst: tekst,
        datumPonude: datumPonude,
        odbijenaPonuda: odbijenaPonuda,
        nekretninaId: id,
        korisnikId: korisnik.id,
        cijenaPonude: ponudaCijene,
        korijenskiId: null
      });
    }

    res.status(200).json({ poruka: 'Ponuda je uspješno poslana' });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/nekretnina/:id/zahtjev', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { id } = req.params;
  const { tekst, trazeniDatum } = req.body;

  try {
    datum = new Date(trazeniDatum);

    if (datum < new Date()) {
      return res.status(400).json({ greska: 'Neispravan datum' });
    }

    const korisnik = await db.korisnik.findOne({ where: { username: req.session.username } });

    if (!korisnik) {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const nekretnina = await db.nekretnina.findOne({ where: { id: id } });

    if (!nekretnina) {
      return res.status(404).json({ greska: 'Nekretnina nije pronadjena' });
    }

    db.zahtjev.create({
      tekst: tekst,
      trazeniDatum: trazeniDatum,
      korisnikId: korisnik.id,
      nekretninaId: id,
      odobren: null
    });

    res.status(200).json({ poruka: 'Zahtjev je uspješno poslan' });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/nekretnina/:id/zahtjev/:zid', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { id, zid } = req.params;
  const { odobren, addToTekst } = req.body;

  try {
    const korisnik = await db.korisnik.findOne({ where: { username: req.session.username } });

    if (!korisnik || !korisnik.admin) {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const zahtjev = await db.zahtjev.findOne({ where: {id: zid} });

    if (!zahtjev) {
      return res.status(404).json({ greska: 'Zahtjev nije pronadjen' });
    }
    if (!odobren && !addToTekst) {
      return res.status(400).json({ greska: 'Nedostaje odgovor' });
    }
    
    zahtjev.odobren = odobren;
    if (addToTekst) {
      zahtjev.tekst += `\n ODGOVOR ADMINA: ${addToTekst}`;
    }

    zahtjev.save();

    res.status(200).json({ poruka: 'Zahtjev je uspješno uredjen' });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* ----------------- MARKETING ROUTES ----------------- */

// Route that increments value of pretrage for one based on list of ids in nizNekretnina
app.post('/marketing/nekretnine', async (req, res) => {
  const { nizNekretnina } = req.body;

  try {
    // Load JSON data
    let preferencije = await readJsonFile('preferencije');

    // Check format
    if (!preferencije || !Array.isArray(preferencije)) {
      console.error('Neispravan format podataka u preferencije.json.');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Init object for search
    preferencije = preferencije.map((nekretnina) => {
      nekretnina.pretrage = nekretnina.pretrage || 0;
      return nekretnina;
    });

    // Update atribute pretraga
    nizNekretnina.forEach((id) => {
      const nekretnina = preferencije.find((item) => item.id === id);
      if (nekretnina) {
        nekretnina.pretrage += 1;
      }
    });

    // Save JSON file
    await saveJsonFile('preferencije', preferencije);

    res.status(200).json({});
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const nekretninaData = preferencije.find((item) => item.id === parseInt(id, 10));

    if (nekretninaData) {
      // Update clicks
      nekretninaData.klikovi = (nekretninaData.klikovi || 0) + 1;

      // Save JSON file
      await saveJsonFile('preferencije', preferencije);

      res.status(200).json({ success: true, message: 'Broj klikova ažuriran.' });
    } else {
      res.status(404).json({ error: 'Nekretnina nije pronađena.' });
    }
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/pretrage', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, pretrage: nekretninaData ? nekretninaData.pretrage : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/klikovi', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, klikovi: nekretninaData ? nekretninaData.klikovi : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});