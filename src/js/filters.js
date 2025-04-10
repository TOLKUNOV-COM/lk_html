export default function filters() {
    // Expand / Collapse handler
    document.addEventListener("DOMContentLoaded", () => {
        const filterBlocks = document.querySelectorAll(".filter__items");

        filterBlocks.forEach((block) => {
            const expandBtn = block.querySelector(".filter__item_expand");
            const collapseBtn = block.querySelector(".filter__item_collapse");
            const filterItems = block.querySelectorAll(".filter__item");

            expandBtn?.addEventListener("click", (e) => {
                e.preventDefault();
                expandBtn.classList.add("hidden");

                let found = false;
                filterItems.forEach((el) => {
                    if (found && el.classList.contains("hidden")) {
                        el.classList.remove("hidden");
                    }
                    if (el === expandBtn) {
                        found = true;
                    }
                });
            });

            collapseBtn?.addEventListener("click", (e) => {
                e.preventDefault();
                collapseBtn.classList.add("hidden");

                let reverseItems = Array.from(filterItems).reverse();
                for (let el of reverseItems) {
                    if (el === expandBtn) {
                        expandBtn.classList.remove("hidden");
                        break;
                    }
                    if (el !== collapseBtn) {
                        el.classList.add("hidden");
                    }
                }
            });
        });
    });

    const el = document.querySelector('.filters__scroll');
    const container = document.querySelector('.filters');

    // Hide shadow at scroll bottom
    el.addEventListener('scroll', () => {
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

        if (isAtBottom) {
            el.classList.add('at-bottom');
        } else {
            el.classList.remove('at-bottom');
        }
    });

    // Open / close handlers
    document.getElementById('filters_toggle').addEventListener('click', () => {
        $(container).toggleClass('filters_collapsed');
    });
    document.getElementById('filters_close').addEventListener('click', () => {
        $(container).addClass('filters_collapsed');
    });
}
