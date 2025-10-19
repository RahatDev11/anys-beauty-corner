// ✅ সঠিক লজিক
const toggleCartSidebar = useCallback(() => {
    setIsOpen(prev => {
        const newState = !prev;
        if (newState) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return newState;
    });
}, []);