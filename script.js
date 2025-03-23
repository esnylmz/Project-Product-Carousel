(() => {
    const init = () => {
        buildCSS();
        buildHTML();
    };

    const buildCSS = () => {
        const css = `
            .custom-carousel-container {
                width: 100%;
                margin: 20px 0;
                background-color: #ffffff;
                padding: 20px 0;
            }
            .banner {
                background-color: #ffffff;
                padding: 20px 0;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 15px;
            }
            .banner__titles {
                text-align: center;
                margin-bottom: 20px;
            }
            .title-primary {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                font-family: 'Arial', sans-serif;
            }
            .banner__wrapper {
                position: relative;
            }
            .owl-carousel {
                display: flex;
                overflow-x: auto;
                gap: 20px;
                padding: 10px;
                scroll-behavior: smooth;
            }
            .owl-stage {
                display: flex;
                overflow: hidden;
            }
            .owl-item {
                flex: 0 0 auto;
                width: 277.5px;
                margin-right: 20px;
            }
            .product-item {
                text-align: center;
                cursor: pointer;
                background-color: #fff;
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .product-item__img img {
                width: 100%;
                height: auto;
                border-radius: 8px;
            }
            .product-item-content {
                margin-top: 10px;
            }
            .product-item__brand {
                font-size: 14px;
                font-weight: bold;
                color: #333;
                font-family: 'Arial', sans-serif;
            }
            .stars-wrapper {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .cx-star-rating {
                display: flex;
                align-items: center;
            }
            .cx-icon {
                font-size: 12px;
                color: #ffa500;
            }
            .review-count {
                font-size: 12px;
                color: #333;
                margin-left: 5px;
            }
            .product-item__price {
                margin: 10px 0;
            }
            .product-item__old-price {
                text-decoration: line-through;
                color: gray;
                font-size: 12px;
            }
            .product-item__percent {
                color: green;
                font-size: 12px;
                margin-left: 5px;
            }
            .product-item__new-price {
                color: red;
                font-weight: bold;
                font-size: 16px;
            }
            .heart-icon {
                position: absolute;
                top: 20px;
                right: 20px;
                cursor: pointer;
                font-size: 40px;
                color: orange;
                transition: color 0.3s ease;
            }
            .heart-icon.filled {
                color: orange;
            }
            .heart-icon.hovered {
                display: none;
            }
            .product-item__add-to-cart {
                margin-top: 10px;
            }
            .custom-carousel-container .product-item .btn.close-btn {
                position: relative;
                z-index: 2;
                margin-top: 19px;
            }
            .custom-carousel-container .btn.close-btn {
                width: 100%;
                padding: 15px 20px;
                border-radius: 37.5px;
                background-color: #fff7ec;
                color: #f28e00;
                font-family: Poppins, "cursive";
                font-size: 1.4rem;
                font-weight: 700;
                margin-top: 25px;
                border: none;
                cursor: pointer;
                transition: background-color 0.3s ease, color 0.3s ease;
            }
            .custom-carousel-container .btn.close-btn:hover {
                background-color: #f28e00;
                color: #fff7ec;
            }
            .swiper-prev,
            .swiper-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                border-radius: 50%;
                z-index: 10;
            }
            .swiper-prev {
                left: 10px;
            }
            .swiper-next {
                right: 10px;
            }
        `;

        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    const buildHTML = async () => {
        // Kullanıcı ana sayfada mı değil mi kontrol et
        if (!window.location.pathname.endsWith('/')) {
            console.log('Yanlış sayfa');
            return;
        }

        console.log('Kod ana sayfada çalışıyor');

        // Ürünleri localStırage'dan al veya API'den çek
        const storedProducts = localStorage.getItem('products');
        const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

        if (storedProducts) {
            console.log('Ürünler yerel depolamadan alınıyor');
            const products = JSON.parse(storedProducts);
            await displayProducts(products, favoriteProducts);
        } else {
            console.log('Ürünler API\'den çekiliyor');
            await fetchProducts(favoriteProducts);
        }
    };

    const fetchProducts = async (favoriteProducts) => {
        try {
            const response = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
            const products = await response.json();
            localStorage.setItem('products', JSON.stringify(products));
            await displayProducts(products, favoriteProducts);
        } catch (error) {
            console.error('Ürünler çekilirken hata oluştu:', error);
        }
    };

    //Değerlendirme sayısını çek
    const fetchRatingAndReviews = async (url) => {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // Puan ve yorum sayısını çıkar
            const ratingElement = doc.querySelector('.rating');
            if (ratingElement) {
                const ratingText = ratingElement.querySelector('.small')?.textContent;
                const reviewCountText = ratingElement.querySelector('.count')?.textContent;

                if (ratingText && reviewCountText) {
                    const rating = parseFloat(ratingText.replace(',', '.'));
                    const reviewCount = reviewCountText.match(/\d+/)?.[0] || '0';
                    return { rating, reviewCount };
                }
            }
        } catch (error) {
            console.error('Puan ve yorumlar çekilirken hata oluştu:', error);
        }
        return { rating: 0, reviewCount: '0' };
    };

    //displayProducts fonksiyonu ve carousel'ın oluşturulması
    const displayProducts = async (products, favoriteProducts) => {
        console.log('Ürünler gösteriliyor:', products);

        const carouselTitle = "Beğenebileceğinizi Düşündüklerimiz";
        const carouselHTML = `
            <div class="custom-carousel-container">
                <div class="banner">
                    <div class="container">
                        <div class="banner__titles">
                            <h2 class="title-primary">${carouselTitle}</h2>
                        </div>
                        <div class="banner__wrapper">
                            <div class="owl-carousel owl-theme owl-loaded owl-responsive owl-drag">
                                <div class="owl-stage-outer">
                                    <div class="owl-stage">
                                        ${(await Promise.all(products.map(async product => {
                                            const { rating, reviewCount } = await fetchRatingAndReviews(product.url);
                                            const isFavorite = favoriteProducts.includes(product.id.toString());
                                            return `
                                                <div class="owl-item">
                                                    <div class="product-item">
                                                        <a class="product-item-anchor" href="${product.url}">
                                                            <figure class="product-item__img">
                                                                <div class="product-item__multiple-badge">
                                                                    <span class="d-flex flex-column">
                                                                        <img alt="Popular" loading="lazy" src="assets/images/cok-satan.png" srcset="assets/images/cok-satan@2x.png 2x, assets/images/cok-satan@3x.png 3x">
                                                                        <img alt="Popular" loading="lazy" src="assets/images/yildiz-urun.png" srcset="assets/images/yildiz-urun@2x.png 2x, assets/images/yildiz-urun@3x.png 3x">
                                                                    </span>
                                                                </div>
                                                                <img class="lazyloaded" alt="${product.name}" data-src="${product.img}" src="${product.img}">
                                                            </figure>
                                                            <div class="product-item-content">
                                                                <h2 class="product-item__brand"><b>${product.brand}</b> - <span>${product.name}</span></h2>
                                                                <div class="d-flex mb-2 stars-wrapper align-items-center">
                                                                    <cx-star-rating disabled="true" style="--star-fill: ${rating};">
                                                                        ${generateStarRating(rating)}
                                                                    </cx-star-rating>
                                                                    <p class="review-count">(${reviewCount})</p>
                                                                </div>
                                                                <div class="product-item__price">
                                                                    ${product.original_price !== product.price ? 
                                                                        `<span class="product-item__old-price">${product.original_price} TL</span>
                                                                         <span class="product-item__percent">${calculateDiscount(product.original_price, product.price)}% <i class="icon icon-decrease"></i></span>
                                                                         <span class="product-item__new-price discount-product">${product.price} TL</span>` 
                                                                        : `<span class="product-item__new-price">${product.price} TL</span>`
                                                                    }
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <div class="heart-icon ${isFavorite ? 'filled' : ''}" data-id="${product.id}">
                                                            ${isFavorite ? '&#9829;' : '&#9825;'}
                                                        </div>
                                                        <div class="product-item__add-to-cart">
                                                            <form novalidate="" class="ng-untouched ng-pristine ng-valid ng-star-inserted">
                                                                <button id="addToCartBtn" type="submit" class="btn close-btn disable ng-star-inserted">Sepete Ekle</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }))).join('')}
                                    </div>
                                </div>
                                <div class="owl-nav disabled">
                                    <div class="owl-prev"><i class="icon icon-prev"></i></div>
                                    <div class="owl-next"><i class="icon icon-next"></i></div>
                                </div>
                                <div class="owl-dots disabled"></div>
                            </div>
                            <button aria-label="back" class="swiper-prev"></button>
                            <button aria-label="next" class="swiper-next"></button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Carousel'ı doğru elementin sonuna ekle
        //Burada, sitede localimde stories sekmesi oluşmadı, bu yüzden stories'den önce gelen banner'ın altına ekledim.
        const targetElement = document.querySelector('eb-hero-banner-carousel');
        if (targetElement) {
            console.log('Carousel sayfaya ekleniyor');
            targetElement.insertAdjacentHTML('afterend', carouselHTML);
            setEvents();
        } else {
            console.error('Hedef element bulunamadı. Lütfen seçiciyi kontrol edin.');
        }
    };

    const generateStarRating = (rating) => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<cx-icon class="star cx-icon fas fa-star ng-star-inserted"></cx-icon>';
            } else {
                stars += '<cx-icon class="star cx-icon fas fa-star ng-star-inserted"></cx-icon>';
            }
        }
        return stars;
    };

    const calculateDiscount = (originalPrice, discountedPrice) => {
        return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    };

    const setEvents = () => {
        // Kalp ikonuna tıklandığında favori durumunu değiştir
        document.querySelectorAll('.heart-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = icon.dataset.id;
                toggleFavorite(productId, icon);
            });
        });

        // Carousel'daki gezinti butonlarına işlevsellik ekle
        const prevButton = document.querySelector('.swiper-prev');
        const nextButton = document.querySelector('.swiper-next');
        const carousel = document.querySelector('.owl-stage');

        if (prevButton && nextButton && carousel) {
            prevButton.addEventListener('click', () => {
                carousel.scrollBy({ left: -300, behavior: 'smooth' });
            });

            nextButton.addEventListener('click', () => {
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    };

    const toggleFavorite = (productId, icon) => {
        if (!productId) {
            console.error('Ürün ID\'si tanımsız. Kalp ikonundaki data-id özelliğini kontrol edin.');
            return;
        }

        let favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
        productId = productId.toString();

        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
            icon.innerHTML = '&#9825;';
            icon.classList.remove('filled');
        } else {
            favorites.push(productId);
            icon.innerHTML = '&#9829;';
            icon.classList.add('filled');
        }

        localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
    };

    // Carousel'ı başlat
    init();
})();