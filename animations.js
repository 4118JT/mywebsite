(function () {
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var header = document.querySelector('.site-header');
	var lastScrollY = window.scrollY || window.pageYOffset || 0;
	var ticking = false;

	function updateHeader() {
		if (!header || reduceMotion) return;

		var currentScrollY = window.scrollY || window.pageYOffset || 0;
		var scrollingDown = currentScrollY > lastScrollY + 8;
		var scrollingUp = currentScrollY < lastScrollY - 8;
		var nearTop = currentScrollY < 72;

		if (nearTop || scrollingUp) {
			header.classList.remove('is-hidden');
		} else if (scrollingDown) {
			header.classList.add('is-hidden');
		}
		lastScrollY = currentScrollY;
		ticking = false;
	}

	if (header && !reduceMotion) {
		window.addEventListener('scroll', function () {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(updateHeader);
		}, { passive: true });
	}

	var supportsObserver = 'IntersectionObserver' in window;
	var selectors = [
		'.page-hero .container > *',
		'.section-header > *',
		'.hero-simple > *',
		'.copy > *',
		'.cluster div',
		'.case-item .media',
		'.section-soft .container > *',
		'.card',
		'.highlight',
		'.faq details',
		'.compare-wrap',
		'.timeline li',
		'.review-row',
		'.review-card',
		'.price-card',
		'.actions',
		'.process-orbit-wrap',
		'.featured-flow-stage'
	];
	var targets = Array.from(document.querySelectorAll(selectors.join(',')));

	if (!targets.length) return;

	targets.forEach(function (item, index) {
		item.classList.add('scroll-reveal');
		item.style.transitionDelay = (index % 8 * 30) + 'ms';
	});

	if (!supportsObserver || reduceMotion) {
		document.querySelectorAll('.scroll-reveal').forEach(function (item) {
			item.classList.add('is-visible');
		});
		return;
	}

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, {
				threshold: 0.18,
				rootMargin: '0px 0px -14% 0px'
	});

	targets.forEach(function (item) {
		observer.observe(item);
	});
})();
