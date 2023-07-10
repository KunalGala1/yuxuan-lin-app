const fileInputs = document.querySelectorAll('input[type=file]');

fileInputs.forEach(fileInput => {
  fileInput.addEventListener('change', ev => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      document.querySelector('.preview').innerHTML = '';
      document.querySelector('.preview').appendChild(img);
    };
    reader.readAsDataURL(ev.target.files[0]);
  });
});
