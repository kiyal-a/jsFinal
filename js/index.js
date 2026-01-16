let offers = JSON.parse(localStorage.getItem('offers'));

if (!offers || offers.length === 0) {
  offers = [
    {
      type: 'Studio',
      title: 'Résidence Cocody',
      details: 'Studio moderne et lumineux, proche de toutes commodités.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      price: '300000',
      commune: 'Cocody',
      location: 'Riviera'
    },
    {
      type: 'Appartement',
      title: 'Appartement Yopougon',
      details: 'Appartement spacieux dans un quartier calme.',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      price: '200000',
      commune: 'Yopougon',
      location: 'Selmer'
    },
    {
      type: 'Maison',
      title: 'Maison familiale Angré',
      details: 'Maison idéale pour une famille avec parking.',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      price: '800000',
      commune: 'Cocody',
      location: 'Angré 8e tranche'
    }
  ];

  localStorage.setItem('offers', JSON.stringify(offers));
}



let list = document.getElementById('offers');
let count = document.getElementById('count');

function truncate(text, max = 120) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function displayOffers() {
  if (!list) return;
  list.innerHTML = '';
  count.innerText = offers.length;

  for (let i = 0; i < offers.length; i++) {
    const o = offers[i];

    
    const isSidebar = list.classList.contains('space-y-4');

    let card = document.createElement('div');
    if (isSidebar) {
      card.className = 'bg-white rounded shadow p-3 flex flex-col';
      card.innerHTML = '\n        <h4 class="font-semibold text-sm">' + o.title + '</h4>\n        <p class="text-xs text-gray-700 mb-2">' + truncate(o.details, 80) + '</p>\n        <p class="text-sm font-bold mb-2">Prix: ' + o.price + ' FCFA</p>\n        <div class="flex">\n          <button class="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2" onclick="deleteOffer(' + i + ')">Supprimer</button>\n          <button class="bg-blue-500 text-white text-xs px-2 py-1 rounded" onclick="startEdit(' + i + ')">Modifier</button>\n        </div>\n      ';
    } else {
      card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full';
      card.innerHTML = '\n        <div class="p-5">\n          <h3 class="font-bold text-lg text-gray-900 mb-2">' + o.title + '</h3>\n          <p class="text-sm text-gray-600 line-clamp-2">' + truncate(o.details, 100) + '</p>\n        </div>\n        <img src="' + o.image + '" alt="' + o.title + '" class="w-full h-56 object-cover">\n        <div class="px-5 py-4 border-t">\n          <p class="text-lg font-semibold text-blue-600">Prix: ' + o.price + ' FCFA</p>\n        </div>\n      ';
    }

    list.appendChild(card);
  }
}

displayOffers();


function deleteOffer(index) {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Voulez-vous supprimer cette offre ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      offers.splice(index, 1);
      localStorage.setItem('offers', JSON.stringify(offers));
      displayOffers();
      Swal.fire(
        'Supprimé!',
        'L\'offre a été supprimée avec succès.',
        'success'
      );
    }
  });
}


function startEdit(index) {
 
  localStorage.setItem('editIndex', index);
  window.location.href = 'modif.html';
}

function validateForm() {
  const type = document.getElementById('type').value.trim();
  const title = document.getElementById('title').value.trim();
  const details = document.getElementById('details').value.trim();
  const image = document.getElementById('image').value.trim();
  const price = document.getElementById('price').value.trim();
  const commune = document.getElementById('commune').value.trim();
  const location = document.getElementById('location').value.trim();

  if (!type || !title || !details || !image || !price || !commune || !location) {
    Swal.fire({
      icon: 'error',
      title: 'Champs manquants',
      text: 'Veuillez remplir tous les champs obligatoires.'
    });
    return false;
  }

  if (isNaN(price) || price <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Prix invalide',
      text: 'Le prix doit être un nombre positif.'
    });
    return false;
  }

  return true;
}


let publishForm = document.getElementById('publishForm');
if (publishForm) {
  publishForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const newOffer = {
      type: document.getElementById('type').value,
      title: document.getElementById('title').value,
      details: document.getElementById('details').value,
      image: document.getElementById('image').value,
      price: document.getElementById('price').value,
      commune: document.getElementById('commune').value,
      location: document.getElementById('location').value,
    };

    offers.unshift(newOffer);
    localStorage.setItem('offers', JSON.stringify(offers));
    
    
    Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: 'Offre publiée avec succès !',
      confirmButtonText: 'OK'
    });
    
    
    publishForm.reset();
    
    
    displayOffers();
  });
}


let editForm = document.getElementById('editForm');
if (editForm) {
  
  const typeSelect = document.getElementById('type');
  if (typeSelect && typeSelect.options.length === 0) {
    ['Studio', 'Appartement', 'Maison'].forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.text = t;
      typeSelect.add(opt);
    });
  }

  const editIndex = localStorage.getItem('editIndex');
  if (editIndex === null) {

    window.location.href = 'index.html';
  } else {
    const idx = parseInt(editIndex, 10);
    if (offers[idx]) {
      const editTitle = document.getElementById('editTitle');
      if (editTitle) {
        editTitle.innerText = 'MODIFIER UNE OFFRE';
      }
      document.getElementById('type').value = offers[idx].type || '';
      document.getElementById('title').value = offers[idx].title || '';
      document.getElementById('details').value = offers[idx].details || '';
      document.getElementById('image').value = offers[idx].image || '';
      document.getElementById('price').value = offers[idx].price || '';
      document.getElementById('commune').value = offers[idx].commune || '';
      document.getElementById('location').value = offers[idx].location || '';
    }

    editForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      offers[idx] = {
        type: document.getElementById('type').value,
        title: document.getElementById('title').value,
        details: document.getElementById('details').value,
        image: document.getElementById('image').value,
        price: document.getElementById('price').value,
        commune: document.getElementById('commune').value,
        location: document.getElementById('location').value,
      };

      localStorage.setItem('offers', JSON.stringify(offers));
      localStorage.removeItem('editIndex');
      
      
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Offre modifiée avec succès !',
        confirmButtonText: 'OK'
      });
      
      
      displayOffers();
    });
  }
}