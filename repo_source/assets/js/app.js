(()=>{
  const root=document.documentElement;
  const menu=document.getElementById('mobile-menu');
  const nav=document.getElementById('main-nav');
  const saved=localStorage.getItem('wdh-theme');

  const setTheme=(theme,persist=true)=>{
    root.dataset.theme=theme;
    if(persist) localStorage.setItem('wdh-theme',theme);
    document.querySelectorAll('[data-theme-set]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.themeSet===theme);
      btn.setAttribute('aria-pressed',btn.dataset.themeSet===theme?'true':'false');
    });
  };

  setTheme(saved==='dark'||saved==='light'?saved:'light',false);

  document.querySelectorAll('[data-theme-set]').forEach(btn=>{
    btn.addEventListener('click',()=>setTheme(btn.dataset.themeSet));
  });

  // NOTE: the old hamburger → #main-nav toggle that used to live here has
  // been removed. It targeted the same #mobile-menu/#main-nav elements as
  // the new mega navigation (assets/js/mega-nav.js), and having both active
  // at once caused the two scripts to fight over the same open/close state.
  // Mobile menu open/close is now handled entirely by mega-nav.js.

  document.querySelectorAll('[data-menu-toggle]').forEach(button=>{
    button.addEventListener('click',(e)=>{
      e.stopPropagation();
      const target=document.getElementById(button.dataset.menuToggle);
      const open=target?.classList.toggle('open');
      button.setAttribute('aria-expanded',open?'true':'false');
    });
  });

  /* -----------------------------------------------------------------------
     Desktop navigation dropdowns.
     The submenu sits almost directly under its parent and a transparent
     bridge covers the remaining distance. JS also uses a short close delay,
     so a normal diagonal mouse movement cannot make the menu disappear.
  ----------------------------------------------------------------------- */
  const desktop=()=>window.matchMedia('(min-width:901px)').matches;
  if(nav){
    nav.querySelectorAll('.nav-dropdown').forEach(parent=>{
      let closeTimer;
      const openMenu=()=>{
        if(!desktop()) return;
        clearTimeout(closeTimer);
        parent.classList.add('open');
      };
      const closeMenu=()=>{
        if(!desktop()) return;
        clearTimeout(closeTimer);
        closeTimer=setTimeout(()=>parent.classList.remove('open'),700);
      };
      parent.addEventListener('mouseenter',openMenu);
      parent.addEventListener('mouseleave',closeMenu);
      parent.addEventListener('focusin',openMenu);
      parent.addEventListener('focusout',e=>{
        if(!parent.contains(e.relatedTarget)) closeMenu();
      });
    });
  }

  /* Mobile: tap a parent item to reveal its submenu. */
  nav?.querySelectorAll('.nav-dropdown > a').forEach(link=>{
    link.addEventListener('click',(e)=>{
      if(window.matchMedia('(max-width:900px)').matches){
        const parent=link.parentElement;
        if(parent?.querySelector('.nav-dropdown-menu')){
          e.preventDefault();
          parent.classList.toggle('open');
        }
      }
    });
  });

  /* -----------------------------------------------------------------------
     Language selector: same pointer-safe behaviour as the main nav.
  ----------------------------------------------------------------------- */
  document.querySelectorAll('.lang-switch').forEach(wrapper=>{
    const dropdown=wrapper.querySelector('.lang-menu');
    const trigger=wrapper.querySelector('.top-control,button,[aria-haspopup="true"]');
    if(!dropdown) return;
    let timer;
    const open=()=>{clearTimeout(timer);dropdown.classList.add('open');trigger?.setAttribute('aria-expanded','true');};
    const close=()=>{clearTimeout(timer);timer=setTimeout(()=>{dropdown.classList.remove('open');trigger?.setAttribute('aria-expanded','false');},500);};
    wrapper.addEventListener('mouseenter',open);
    wrapper.addEventListener('mouseleave',close);
    wrapper.addEventListener('focusin',open);
    wrapper.addEventListener('focusout',e=>{if(!wrapper.contains(e.relatedTarget)) close();});
  });

  /* -----------------------------------------------------------------------
     Currency selector: present a real dropdown instead of cycling values on
     click. Existing markup is reused; BDT/USD are the approved currencies.
  ----------------------------------------------------------------------- */
  document.querySelectorAll('.currency-switch').forEach(wrapper=>{
    const trigger=wrapper.querySelector('.currency-control,button,[aria-haspopup="true"]');
    if(!trigger) return;

    let dropdown=wrapper.querySelector('.currency-menu');
    if(!dropdown){
      dropdown=document.createElement('div');
      dropdown.className='currency-menu';
      dropdown.setAttribute('role','menu');
      dropdown.innerHTML='<button type="button" data-currency="BDT" role="menuitem">৳ BDT</button><button type="button" data-currency="USD" role="menuitem">$ USD</button>';
      wrapper.appendChild(dropdown);
    }

    const savedCurrency=localStorage.getItem('wdh-currency');
    let current=(savedCurrency==='USD'||savedCurrency==='BDT')?savedCurrency:'BDT';

    const updateCurrency=(currency,persist=true)=>{
      current=currency;
      if(persist) localStorage.setItem('wdh-currency',currency);
      dropdown.querySelectorAll('[data-currency]').forEach(item=>item.classList.toggle('active',item.dataset.currency===currency));

      /* Replace only text nodes so any existing icon inside the trigger is preserved. */
      const textNode=[...trigger.childNodes].find(n=>n.nodeType===Node.TEXT_NODE && n.textContent.trim());
      if(textNode) textNode.textContent=(currency==='USD'?'$ USD':'৳ BDT');
      trigger.setAttribute('aria-label',currency==='USD'?'Currency: USD':'Currency: BDT');
    };
    updateCurrency(current,false);

    let timer;
    const open=()=>{clearTimeout(timer);dropdown.classList.add('open');trigger.setAttribute('aria-expanded','true');};
    const close=()=>{clearTimeout(timer);timer=setTimeout(()=>{dropdown.classList.remove('open');trigger.setAttribute('aria-expanded','false');},500);};

    trigger.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded',dropdown.classList.contains('open')?'true':'false');
    });
    wrapper.addEventListener('mouseenter',open);
    wrapper.addEventListener('mouseleave',close);
    wrapper.addEventListener('focusin',open);
    wrapper.addEventListener('focusout',e=>{if(!wrapper.contains(e.relatedTarget)) close();});

    dropdown.querySelectorAll('[data-currency]').forEach(item=>{
      item.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        updateCurrency(item.dataset.currency);
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded','false');
      });
    });
  });

  /* Close open popovers when clicking elsewhere. */
  document.addEventListener('click',(e)=>{
    document.querySelectorAll('.lang-menu.open,.currency-menu.open,.account-menu.open').forEach(el=>{
      if(!el.parentElement?.contains(e.target)){
        el.classList.remove('open');
        el.parentElement?.querySelector('[aria-expanded="true"]')?.setAttribute('aria-expanded','false');
      }
    });
    if(nav?.classList.contains('open') && !nav.contains(e.target) && !menu?.contains(e.target)){
      nav.classList.remove('open');
      menu?.setAttribute('aria-expanded','false');
    }
  });
  /* Domain search: show a spinner on the button while the search page loads. */
  document.querySelectorAll('.domain-search form, .domain-results-form').forEach((form)=>{
    form.addEventListener('submit', ()=>{
      const btn = form.querySelector('button[type="submit"]');
      if(!btn || btn.classList.contains('is-loading')) return;
      btn.classList.add('is-loading');
      btn.disabled = true;
    });
  });
})();
