export default {
    bind: function(el, binding) {
        el.classList.add('g-file-wrapper');

        const oldFile = el.querySelector('.g-file-input');

        if (oldFile) {
            oldFile.remove()
        }

        const file = window.document.createElement('input');

        file.type = 'file';
        file.className = 'g-file-input';
        file.accept = 'image/*';

        file.addEventListener('change', () => {
            binding.value(file)
        });

        el.appendChild(file)
    }
}
