// 重庆旅行攻略网页交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 滚动到顶部按钮
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.remove('hidden');
            } else {
                scrollToTopBtn.classList.add('hidden');
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 打印功能
    const printBtn = document.getElementById('printBtn');
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 景点卡片动画效果
    const attractionCards = document.querySelectorAll('.card-hover');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        attractionCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // 图片放大功能
    const metroMap = document.querySelector('img[src="images/chongqing_metro_map.png"]');
    if (metroMap) {
        metroMap.style.cursor = 'zoom-in';
        metroMap.addEventListener('click', function() {
            if (this.style.transform === 'scale(1.5)') {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
            } else {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
            }
            this.style.transition = 'transform 0.3s ease';
        });
    }

    // 景点详情弹窗功能
    const attractionItems = document.querySelectorAll('#attractions .bg-white.rounded-lg.shadow-lg');
    attractionItems.forEach(item => {
        const title = item.querySelector('h3').textContent;
        const img = item.querySelector('img').src;
        const description = item.querySelector('p').textContent;
        const details = Array.from(item.querySelectorAll('div.flex.items-center')).map(el => el.textContent.trim()).join('\n');
        
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            showDetailModal(title, img, description, details);
        });
    });

    // 美食详情弹窗功能
    const foodItems = document.querySelectorAll('#food .bg-white.rounded-lg.shadow-lg');
    foodItems.forEach(item => {
        const title = item.querySelector('h3').textContent;
        const img = item.querySelector('img')?.src || '';
        const description = item.querySelector('p')?.textContent || '';
        const details = Array.from(item.querySelectorAll('div.border-l-4')).map(el => {
            const name = el.querySelector('h4').textContent;
            const desc = el.querySelector('p').textContent;
            return `${name}: ${desc}`;
        }).join('\n\n');
        
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            showDetailModal(title, img, description, details);
        });
    });

    // 预算计算器功能
    createBudgetCalculator();

    // 天数切换功能
    createDaySelector();

    // 快捷键功能
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
});

// 显示详情弹窗
function showDetailModal(title, imageUrl, description, details) {
    // 创建模态框HTML
    const modalHtml = `
        <div id="detailModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-2xl font-bold text-cq-gray">${title}</h3>
                        <button id="closeModal" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="w-full h-48 object-cover rounded-lg mb-4">` : ''}
                    <p class="text-gray-700 mb-4">${description}</p>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-bold text-cq-red mb-2">详细信息</h4>
                        <div class="whitespace-pre-line text-gray-600">${details}</div>
                    </div>
                     <div class="mt-4 text-center">
                         <a href="ai/${encodeURIComponent(title)}.txt" class="text-blue-500 hover:underline" target="_blank"></a>
                     </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 关闭模态框功能
    const closeModal = document.getElementById('closeModal');
    const modal = document.getElementById('detailModal');
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// 预算计算器
function createBudgetCalculator() {
    const budgetData = {
        economic: { accommodation: 2000, food: 2000, transport: 250, tickets: 135, other: 500 },
        standard: { accommodation: 3600, food: 3000, transport: 500, tickets: 135, other: 1000 },
        luxury: { accommodation: 6000, food: 5000, transport: 1000, tickets: 135, other: 2000 }
    };

    const budgetSection = document.getElementById('budget');
    if (budgetSection) {
        const calculatorHtml = `
            <div class="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h3 class="text-xl font-bold mb-4 text-center text-cq-gray">🧮 预算快速计算器</h3>
                <div class="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">天数</label>
                        <select id="daysSelect" class="border rounded px-3 py-2 w-full">
                            <option value="3">3天2晚</option>
                            <option value="5" selected>5天4晚</option>
                            <option value="7">7天6晚</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">预算类型</label>
                        <select id="budgetType" class="border rounded px-3 py-2 w-full">
                            <option value="economic">经济型</option>
                            <option value="standard" selected>中档型</option>
                            <option value="luxury">高档型</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">大人数量</label>
                        <input type="number" id="adults" value="3" min="1 max="6" class="border rounded px-3 py-2 w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">儿童数量</label>
                        <input type="number" id="children" value="1" min="0" max="4" class="border rounded px-3 py-2 w-full">
                    </div>
                </div>
                <div id="calculatorResult" class="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-800">预估总费用: <span id="totalCost">8,235</span> 元</div>
                    <div class="text-sm text-blue-600 mt-1">人均费用: <span id="perPersonCost">2,059</span> 元</div>
                </div>
            </div>
        `;
        
        budgetSection.insertAdjacentHTML('beforeend', calculatorHtml);

        const daysSelect = document.getElementById('daysSelect');
        const budgetTypeSelect = document.getElementById('budgetType');
        const adultsInput = document.getElementById('adults');
        const childrenInput = document.getElementById('children');

        function updateCalculation() {
            const days = parseInt(daysSelect.value);
            const type = budgetTypeSelect.value;
            const adults = parseInt(adultsInput.value) || 0;
            const children = parseInt(childrenInput.value) || 0;
            const totalPeople = adults + children;

            if (totalPeople === 0) return;

            const baseBudget = budgetData[type];
            let totalCost = 0;

            const dayMultiplier = days === 3 ? 0.6 : days === 7 ? 1.4 : 1;
            
            totalCost += baseBudget.accommodation * (days - 1) / 4;
            totalCost += baseBudget.food * days / 5;
            totalCost += baseBudget.transport * days / 5;
            totalCost += baseBudget.tickets * (adults + children * 0.5);
            totalCost += baseBudget.other * dayMultiplier;

            const perPersonCost = Math.round(totalCost / totalPeople);
            totalCost = Math.round(totalCost);

            document.getElementById('totalCost').textContent = totalCost.toLocaleString();
            document.getElementById('perPersonCost').textContent = perPersonCost.toLocaleString();
        }

        daysSelect.addEventListener('change', updateCalculation);
        budgetTypeSelect.addEventListener('change', updateCalculation);
        adultsInput.addEventListener('input', updateCalculation);
        childrenInput.addEventListener('input', updateCalculation);

        updateCalculation();
    }
}

// 天数选择器
function createDaySelector() {
    const daysSection = document.getElementById('days');
    if (daysSection) {
        const planCards = daysSection.querySelectorAll('.plan-card');
        
        planCards.forEach((card, index) => {
            card.addEventListener('click', function() {
                planCards.forEach(c => {
                    c.classList.remove('transform', 'scale-105', 'shadow-xl');
                    c.classList.add('shadow-lg');
                });
                
                this.classList.add('transform', 'scale-105', 'shadow-xl');
                this.classList.remove('shadow-lg');
                
                const daysSelect = document.getElementById('daysSelect');
                if (daysSelect) {
                    const dayValues = ['3', '5', '7'];
                    daysSelect.value = dayValues[index];
                    daysSelect.dispatchEvent(new Event('change'));
                }
                
                showToast(getCardTitle(index) + ' 已选择');
            });
        });
    }
}

function getCardTitle(index) {
    const titles = ['3天2晚 山城核心精华游', '5天4晚 经典亲子休闲游', '7天6晚 重庆全景深度游'];
    return titles[index];
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-cq-red text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translate(-50%, 0)';
        toast.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translate(-50%, -20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 页面加载动画
window.addEventListener('load', function() {
    const header = document.querySelector('header');
    if (header) {
        header.style.animation = 'fadeIn 1s ease-in-out';
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slide-in {
            animation: slideInFromLeft 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
});
