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

        // Search handler
        const searchInputs = document.querySelectorAll(".filter-search__input");

        searchInputs.forEach((searchInput) => {
            const filterBlock = searchInput.closest(".filter");
            const itemsContainer = filterBlock?.querySelector(".filter__items");

            if (!itemsContainer) {
                return;
            }

            const expandBtn = itemsContainer.querySelector(".filter__item_expand");
            const collapseBtn = itemsContainer.querySelector(".filter__item_collapse");
            const allItems = Array.from(itemsContainer.querySelectorAll(".filter__item")).filter(
                (item) => !item.classList.contains("filter__item_expand") && !item.classList.contains("filter__item_collapse")
            );

            // Сохраняем исходные позиции всех элементов в DOM
            const originalPositions = new Map();
            allItems.forEach((item) => {
                originalPositions.set(item, {
                    parent: item.parentElement,
                    nextSibling: item.nextSibling
                });
            });

            // Сохраняем исходную позицию и текст кнопки expand
            let originalExpandPosition = null;
            let originalExpandText = null;
            if (expandBtn) {
                originalExpandPosition = {
                    parent: expandBtn.parentElement,
                    nextSibling: expandBtn.nextSibling
                };
                originalExpandText = expandBtn.textContent;
            }

            // Состояние видимости и кнопок перед началом фильтрации
            let stateBeforeFilter = null;
            let previousSearchTerm = "";

            searchInput.addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const wasFiltering = previousSearchTerm !== "";
                const isFiltering = searchTerm !== "";

                // Если начинаем фильтрацию, сохраняем текущее состояние
                if (!wasFiltering && isFiltering) {
                    stateBeforeFilter = {
                        visibility: new Map(),
                        expandVisible: expandBtn ? !expandBtn.classList.contains("hidden") : false,
                        collapseVisible: collapseBtn ? !collapseBtn.classList.contains("hidden") : false
                    };
                    allItems.forEach((item) => {
                        stateBeforeFilter.visibility.set(item, item.classList.contains("hidden"));
                    });
                }

                previousSearchTerm = searchTerm;

                if (searchTerm === "") {
                    // Восстанавливаем позиции элементов
                    allItems.forEach((item) => {
                        const position = originalPositions.get(item);
                        if (position) {
                            if (position.nextSibling) {
                                position.parent.insertBefore(item, position.nextSibling);
                            } else {
                                position.parent.appendChild(item);
                            }
                        }

                        // Восстанавливаем видимость из сохраненного состояния
                        if (stateBeforeFilter) {
                            if (stateBeforeFilter.visibility.get(item)) {
                                item.classList.add("hidden");
                            } else {
                                item.classList.remove("hidden");
                            }
                        }
                    });

                    // Восстанавливаем кнопки expand/collapse
                    if (expandBtn) {
                        if (stateBeforeFilter && stateBeforeFilter.expandVisible) {
                            expandBtn.classList.remove("hidden");
                        } else if (stateBeforeFilter && !stateBeforeFilter.expandVisible) {
                            expandBtn.classList.add("hidden");
                        }

                        // Восстанавливаем позицию и текст кнопки
                        if (originalExpandPosition) {
                            if (originalExpandPosition.nextSibling) {
                                originalExpandPosition.parent.insertBefore(expandBtn, originalExpandPosition.nextSibling);
                            } else {
                                originalExpandPosition.parent.appendChild(expandBtn);
                            }
                        }
                        expandBtn.textContent = originalExpandText;
                    }
                    if (collapseBtn) {
                        if (stateBeforeFilter && stateBeforeFilter.collapseVisible) {
                            collapseBtn.classList.remove("hidden");
                        } else {
                            collapseBtn.classList.add("hidden");
                        }
                    }

                    return;
                }

                // Фильтруем элементы
                const activeItems = [];
                const matchedItems = [];

                allItems.forEach((item) => {
                    const text = item.textContent.toLowerCase();
                    const isActive = item.classList.contains("filter__item_active");

                    if (isActive) {
                        activeItems.push(item);
                    } else if (text.includes(searchTerm)) {
                        matchedItems.push(item);
                    } else {
                        item.classList.add("hidden");
                    }
                });

                // При активной фильтрации показываем все найденные элементы
                // Сначала перемещаем активные элементы в начало (в правильном порядке)
                // Используем обратный порядок для вставки, чтобы сохранить правильную последовательность
                activeItems.reverse().forEach((item) => {
                    item.classList.remove("hidden");
                    itemsContainer.insertBefore(item, itemsContainer.firstChild);
                });

                // Показываем все найденные элементы (без лимита)
                matchedItems.forEach((item) => {
                    item.classList.remove("hidden");
                });

                // При активной фильтрации скрываем кнопки expand/collapse
                expandBtn?.classList.add("hidden");
                collapseBtn?.classList.add("hidden");
            });
        });
    });

    const el = document.querySelector('.filters__scroll');
    const container = document.querySelector('.filters');

    if (!el) {
        return;
    }

    // Hide shadow at scroll bottom
    el.addEventListener('scroll', () => {
        const isAtTop = el.scrollTop === 0;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

        el.classList.toggle('at-top', isAtTop);
        el.classList.toggle('at-bottom', isAtBottom);
    });

    // Open / close handlers
    document.getElementById('filters_toggle').addEventListener('click', () => {
        $(container).toggleClass('filters_collapsed');
    });
    document.getElementById('filters_close').addEventListener('click', () => {
        $(container).addClass('filters_collapsed');
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            $(container).addClass('filters_collapsed');
        }
    });
}
