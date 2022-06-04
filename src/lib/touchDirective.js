export default {
    bind: function(el, binding) {
        let className = 'touch';

        if (typeof binding.value === 'string') {
            className = binding.value
        }

        el.classList.add('no-tap-highlight');

        if (binding.modifiers && binding.modifiers.notap) {
            el.style['-webkit-tap-highlight-color'] = 'transparent'
        }

        el.addEventListener('touchstart', () => {
            el.classList.add(className)
        });

        el.addEventListener('touchend', () => {
            el.classList.remove(className);
        })
    }
}
