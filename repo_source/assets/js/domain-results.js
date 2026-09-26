(function(){
    'use strict';

    var page = document.querySelector('.domain-results-page');
    if (!page) return;

    /* Show a spinner on the Search Again button while the page reloads. */
    var searchAgainForm = document.querySelector('.domain-results-form');
    if (searchAgainForm) {
        searchAgainForm.addEventListener('submit', function(){
            var btn = searchAgainForm.querySelector('button[type="submit"]');
            if (btn && !btn.classList.contains('is-loading')) {
                btn.classList.add('is-loading');
                btn.disabled = true;
            }
        });
    }

    /* -----------------------------------------------------------------
       Filters (category tab / price / available-only)
       + "Show More" cap on the results list
    ----------------------------------------------------------------- */
    var table = document.querySelector('.domain-result-table');
    var priceInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="filter-price"]'));
    var availableOnly = document.getElementById('available-only');
    var clearButton = document.querySelector('.domain-clear-filters');
    var categoryTabs = Array.prototype.slice.call(document.querySelectorAll('.domain-category-tab'));
    var resultsShowMore = document.querySelector('.domain-show-more[data-target="results"]');
    var emptyState = null;

    var RESULTS_LIMIT = 10;
    var resultsExpanded = false;

    var initialActiveTab = document.querySelector('.domain-category-tab.is-active');
    var activeCategory = initialActiveTab ? (initialActiveTab.getAttribute('data-category') || '') : '';

    function priceInRange(price, range){
        if (!range) return true;
        if (price === '' || price === null) return false;
        var n = parseFloat(price);
        var parts = range.split('-');
        var min = parseFloat(parts[0]);
        var max = parseFloat(parts[1]);
        return n >= min && n <= max;
    }

    function ensureEmptyState(){
        if (emptyState || !table) return emptyState;
        emptyState = document.createElement('div');
        emptyState.className = 'domain-empty-state';
        emptyState.hidden = true;
        emptyState.innerHTML = '<strong>No matching domains found.</strong><p>Try another extension, price range, or clear the filters.</p>';
        table.appendChild(emptyState);
        return emptyState;
    }

    // Shows only the first `limit` items of `eligible` (already-filtered,
    // in DOM order) unless `expanded` is true. Returns true if there are
    // more eligible items beyond the limit (i.e. the Show More button
    // should be visible).
    function applyLimitedVisibility(eligible, limit, expanded){
        var shown = 0;
        eligible.forEach(function(el){
            var withinLimit = expanded || shown < limit;
            el.hidden = !withinLimit;
            if (withinLimit) shown++;
        });
        return !expanded && eligible.length > limit;
    }

    function applyFilters(){
        var rows = Array.prototype.slice.call(document.querySelectorAll('.domain-result-row'));

        var selectedPrice = '';
        priceInputs.forEach(function(input){
            if (input.checked) selectedPrice = input.value || '';
        });

        // Results list: category tab + price + availability filters,
        // then capped to RESULTS_LIMIT unless expanded.
        var eligibleRows = rows.filter(function(row){
            var availabilityOk = !availableOnly || !availableOnly.checked ||
                row.getAttribute('data-available') === '1';
            var priceOk = priceInRange(row.getAttribute('data-price'), selectedPrice);
            var categoryOk = !activeCategory || row.getAttribute('data-category') === activeCategory;
            var show = availabilityOk && priceOk && categoryOk;
            if (!show) row.hidden = true;
            return show;
        });
        var resultsOverflow = applyLimitedVisibility(eligibleRows, RESULTS_LIMIT, resultsExpanded);
        if (resultsShowMore) resultsShowMore.hidden = !resultsOverflow;

        var empty = ensureEmptyState();
        if (empty) empty.hidden = eligibleRows.length !== 0;
    }

    priceInputs.forEach(function(input){ input.addEventListener('change', applyFilters); });
    if (availableOnly) availableOnly.addEventListener('change', applyFilters);

    if (resultsShowMore) {
        resultsShowMore.addEventListener('click', function(){
            resultsExpanded = true;
            applyFilters();
        });
    }

    categoryTabs.forEach(function(tab){
        tab.addEventListener('click', function(){
            categoryTabs.forEach(function(t){ t.classList.remove('is-active'); });
            tab.classList.add('is-active');
            activeCategory = tab.getAttribute('data-category') || '';
            resultsExpanded = false;
            applyFilters();
        });
    });

    if (clearButton) {
        clearButton.addEventListener('click', function(){
            priceInputs.forEach(function(input){ input.checked = input.value === ''; });
            if (availableOnly) availableOnly.checked = false;
            categoryTabs.forEach(function(t){ t.classList.remove('is-active'); });
            var allTab = categoryTabs.filter(function(t){ return (t.getAttribute('data-category') || '') === ''; })[0];
            if (allTab) allTab.classList.add('is-active');
            activeCategory = '';
            resultsExpanded = false;
            applyFilters();
        });
    }

    var filterCard = document.querySelector('.domain-filter-card');
    var filterToggle = document.querySelector('.domain-filter-toggle');
    if (filterCard && filterToggle) {
        filterToggle.addEventListener('click', function(){
            var open = filterCard.classList.toggle('is-open');
            filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    applyFilters();

    /* -----------------------------------------------------------------
       AJAX cart: Add to Cart / Remove update the cart panel in place.
       Only the "View Cart →" link navigates to cart.php.
    ----------------------------------------------------------------- */
    var cartCount = document.getElementById('domain-cart-count');
    var cartBody = document.getElementById('domain-cart-body');
    var cartError = document.getElementById('domain-cart-error');

    function escapeHtml(str){
        return String(str).replace(/[&<>"']/g, function(ch){
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
        });
    }

    function fmtMoney(amount, currency){
        var n = Math.round(Number(amount) || 0);
        var formatted = n.toLocaleString('en-US');
        return ((currency || '').toUpperCase() === 'USD' ? '$' : '৳') + formatted;
    }

    function getCsrfToken(){
        var input = document.querySelector('input[name="csrf"]');
        return input ? input.value : '';
    }

    function showCartError(message){
        if (!cartError) return;
        cartError.textContent = message || 'Something went wrong. Please try again.';
        cartError.hidden = false;
        clearTimeout(cartError._t);
        cartError._t = setTimeout(function(){ cartError.hidden = true; }, 5000);
    }

    function syncCartButtonStates(items){
        var inCart = {};
        (items || []).forEach(function(item){
            if (item && item.name) inCart[String(item.name).toLowerCase()] = true;
        });

        Array.prototype.slice.call(document.querySelectorAll('.js-cart-add[data-domain]')).forEach(function(form){
            var domain = (form.getAttribute('data-domain') || '').toLowerCase();
            var btn = form.querySelector('button[type="submit"]');
            if (!btn || !domain) return;

            if (inCart[domain]) {
                btn.disabled = true;
                btn.classList.add('is-in-cart');
                btn.textContent = '✓ Added to Cart';
            } else {
                btn.disabled = false;
                btn.classList.remove('is-in-cart');
                btn.textContent = 'Add to Cart →';
            }

            if (form.classList.contains('domain-status-banner-cta')) {
                var continueLink = form.parentElement ? form.parentElement.querySelector('.domain-banner-continue') : null;
                if (continueLink) {
                    var isInCart = !!inCart[domain];
                    continueLink.classList.toggle('is-disabled', !isInCart);
                    if (isInCart) {
                        continueLink.removeAttribute('aria-disabled');
                        continueLink.removeAttribute('tabindex');
                        continueLink.removeAttribute('onclick');
                    } else {
                        continueLink.setAttribute('aria-disabled', 'true');
                        continueLink.setAttribute('tabindex', '-1');
                    }
                }
            }
        });
    }

    function renderCart(data){
        if (!cartBody || !cartCount) return;
        cartCount.textContent = data.count ? ' (' + data.count + ')' : '';

        if (!data.count) {
            cartBody.innerHTML =
                '<p>Your selected domains and services will appear here after you add them to the cart.</p>' +
                '<div class="domain-cart-summary-row"><span>Subtotal</span><strong>—</strong></div>' +
                '<div class="domain-cart-summary-row"><span>VAT/Tax</span><strong>—</strong></div>' +
                '<div class="domain-cart-total"><span>Total</span><strong>—</strong></div>';
            return;
        }

        var csrf = escapeHtml(getCsrfToken());
        var itemsHtml = data.items.map(function(item){
            var wasPrice = item.bundle_discount_applied && item.original_price
                ? '<small class="domain-cart-was">' + fmtMoney(item.original_price, item.currency) + '</small>'
                : '';
            return '<div class="domain-cart-item-row">' +
                '<div class="domain-cart-item-name-wrap"><span class="domain-cart-item-name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</span><small>1 Year Registration</small></div>' +
                '<div class="domain-cart-item-price">' + wasPrice + '<strong>' + fmtMoney(item.price, item.currency) + '</strong></div>' +
                '<form method="post" action="cart.php" class="domain-cart-remove js-cart-remove">' +
                '<input type="hidden" name="csrf" value="' + csrf + '">' +
                '<input type="hidden" name="action" value="remove">' +
                '<input type="hidden" name="index" value="' + item.index + '">' +
                '<button type="submit" aria-label="Remove">✕</button>' +
                '</form>' +
                '</div>';
        }).join('');

        cartBody.innerHTML =
            '<div class="domain-cart-items">' + itemsHtml + '</div>' +
            '<div class="domain-cart-summary-row"><span>Subtotal</span><strong>' + fmtMoney(data.subtotal, data.currency) + '</strong></div>' +
            '<div class="domain-cart-summary-row"><span>VAT/Tax</span><strong>৳0</strong></div>' +
            '<div class="domain-cart-total"><span>Total</span><strong>' + fmtMoney(data.total, data.currency) + '</strong></div>' +
            '<a class="btn primary domain-cart-continue" href="domains.php">Continue Shopping →</a>' +
            '<a class="btn secondary domain-cart-checkout" href="checkout.php">Proceed to Checkout →</a>';
    }

    function submitCartForm(form){
        var formData = new FormData(form);
        formData.set('ajax', '1');

        return fetch(form.getAttribute('action') || 'cart.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).then(function(res){
            return res.json().catch(function(){ return { ok:false, message:'Unexpected server response.' }; })
                .then(function(data){ return { status: res.status, data: data }; });
        });
    }

    // Event delegation: cart body gets rebuilt, so listen on the document.
    document.addEventListener('submit', function(e){
        var form = e.target;
        if (!(form instanceof HTMLFormElement)) return;

        var isAdd = form.classList.contains('js-cart-add');
        var isRemove = form.classList.contains('js-cart-remove');
        if (!isAdd && !isRemove) return;

        e.preventDefault();

        if (form.dataset.submitting === '1') return; // already in flight — ignore repeat clicks
        form.dataset.submitting = '1';

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.disabled = true; }
        if (isAdd && submitBtn) { submitBtn.textContent = 'Adding…'; }

        submitCartForm(form).then(function(result){
            form.dataset.submitting = '0';
            if (result.data && result.data.ok) {
                renderCart(result.data);
                syncCartButtonStates(result.data.items);
                // For 'add' forms, syncCartButtonStates already sets the
                // permanent disabled "✓ Added to Cart" state. Remove forms
                // are entirely replaced by renderCart(), so there's nothing
                // left here to restore.
            } else {
                showCartError(result.data && result.data.message ? result.data.message : 'Could not update your cart. Please try again.');
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        }).catch(function(){
            form.dataset.submitting = '0';
            showCartError('Network error — please check your connection and try again.');
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
    // -------------------------------------------------------------
    // Single-domain recheck ("Try Again" on a row that errored)
    // -------------------------------------------------------------
    document.addEventListener('click', function(e){
        var btn = e.target.closest ? e.target.closest('.js-recheck') : null;
        if (!btn) return;

        var row = btn.closest('.domain-result-row');
        if (!row) return;

        var sld = row.getAttribute('data-sld');
        var tld = row.getAttribute('data-tld');
        if (!sld || !tld) return;

        var originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Checking…';

        fetch('domain-recheck.php?sld=' + encodeURIComponent(sld) + '&tld=' + encodeURIComponent(tld), {
            credentials: 'same-origin'
        }).then(function(res){
            return res.json();
        }).then(function(data){
            if (!data || !data.ok) {
                btn.disabled = false;
                btn.textContent = originalText;
                return;
            }

            var priceCell = row.querySelector('.domain-result-price');
            var actionCell = row.querySelector('.domain-result-action');
            var badge = row.querySelector('.domain-badge.checking');

            if (data.status === 'available') {
                row.setAttribute('data-available', '1');
                row.setAttribute('data-price', data.price ? String(Math.round(data.price.amount)) : '');
                if (badge) badge.remove();
                if (priceCell) {
                    priceCell.innerHTML = data.price_formatted
                        ? '<strong>' + data.price_formatted + '</strong><small>/year</small>'
                        : '<strong>—</strong><small>at checkout</small>';
                }
                if (actionCell) {
                    var csrf = document.querySelector('input[name="csrf"]');
                    actionCell.innerHTML =
                        '<form method="post" action="cart.php" class="js-cart-add" data-domain="' + data.domain + '">' +
                        '<input type="hidden" name="csrf" value="' + (csrf ? csrf.value : '') + '">' +
                        '<input type="hidden" name="action" value="add">' +
                        '<input type="hidden" name="type" value="domain">' +
                        '<input type="hidden" name="name" value="' + data.domain + '">' +
                        '<input type="hidden" name="domain_name" value="' + data.domain + '">' +
                        '<input type="hidden" name="domain" value="' + data.domain + '">' +
                        '<input type="hidden" name="tld" value="' + data.tld + '">' +
                        '<button class="btn primary small" type="submit">Add to Cart →</button>' +
                        '</form>';
                }
            } else if (data.status === 'unavailable') {
                row.setAttribute('data-available', '0');
                if (badge) { badge.textContent = 'TAKEN'; badge.classList.remove('checking'); badge.classList.add('taken'); }
                if (actionCell) {
                    actionCell.innerHTML = '<a class="btn secondary small" href="https://www.whois.com/whois/' + data.domain +
                        '" target="_blank" rel="noopener">Whois</a>';
                }
            } else {
                // Still couldn't verify — reset the button for another try.
                btn.disabled = false;
                btn.textContent = originalText;
            }
        }).catch(function(){
            btn.disabled = false;
            btn.textContent = originalText;
        });
    });
})();
