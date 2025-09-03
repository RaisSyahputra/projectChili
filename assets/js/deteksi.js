(function(){
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('preview');
  const btnOpenCamera = document.getElementById('btnOpenCamera');
  const btnCloseCamera = document.getElementById('btnCloseCamera');
  const btnCapture = document.getElementById('btnCapture');
  const btnDeteksi = document.getElementById('btnDeteksi');
  const cameraWrap = document.getElementById('cameraWrap');
  const video = document.getElementById('video');
  let stream = null;
  let imageReady = false;

  function setImage(dataUrl) {
    sessionStorage.setItem('deteksi_image', dataUrl);
    if (preview) {
      preview.src = dataUrl;
      preview.classList.remove('d-none');
    }
    imageReady = true;
    if (btnDeteksi) btnDeteksi.removeAttribute('disabled');
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImage(url);
    });
  }

  async function openCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (cameraWrap) cameraWrap.classList.remove('d-none');
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch (err) {
      alert('Tidak dapat mengakses kamera: ' + err.message);
    }
  }

  function closeCamera() {
    if (video) video.pause();
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if (cameraWrap) cameraWrap.classList.add('d-none');
  }

  function capture() {
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImage(dataUrl);
  }

  if (btnOpenCamera) btnOpenCamera.addEventListener('click', openCamera);
  if (btnCloseCamera) btnCloseCamera.addEventListener('click', closeCamera);
  if (btnCapture) btnCapture.addEventListener('click', capture);

  if (btnDeteksi) {
    btnDeteksi.addEventListener('click', () => {
      if (!imageReady) { alert('Silakan upload/ambil gambar terlebih dahulu.'); return; }
      window.location.href = 'hasil.html';
    });
  }

  // Load result image if on hasil.html
  document.addEventListener('DOMContentLoaded', function(){
    const resultImg = document.getElementById('result-img');
    if (resultImg) {
      const src = sessionStorage.getItem('deteksi_image');
      if (src) resultImg.src = src;
    }
  });

  // Clean up on unload
  window.addEventListener('beforeunload', closeCamera);
})();