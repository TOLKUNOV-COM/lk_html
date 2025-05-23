export default function scroller() {
    window.addEventListener('beforeunload', () => {
        document.querySelectorAll('[data-scroll-id]').forEach((scroller) => {
            const scrollId = scroller.dataset.scrollId;
            if (scrollId) {
                sessionStorage.setItem(`scrollTop:${scrollId}`, scroller.scrollTop);
            }
        });
    });

    window.addEventListener('pageshow', (event) => {
        const navType = performance.getEntriesByType("navigation")[0]?.type;

        if (event.persisted || navType === 'reload' || navType === 'back_forward') {
            document.querySelectorAll('[data-scroll-id]').forEach((scroller) => {
                const scrollId = scroller.dataset.scrollId;
                if (scrollId) {
                    const saved = sessionStorage.getItem(`scrollTop:${scrollId}`);
                    if (saved !== null) {
                        scroller.scrollTop = parseInt(saved, 10);
                    }
                }
            });
        }
    });
}
