const shareIcon = document.querySelector('#icon');
const tooltipsText = document.querySelector('.tooltip-content');

shareIcon.addEventListener('click', function() {
   tooltipsText.style.visibility = 'visible';
   shareIcon.classList.add('share-icon-state');
   shareIcon.src = 'images/icon-share-white.png';

});
