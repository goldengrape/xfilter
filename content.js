// 定义过滤函数，获取当前关键词列表后检查页面上所有推文和通知
function filterContent() {
  chrome.storage.sync.get({keywords: []}, (data) => {
    const keywords = data.keywords;
    console.log('Keywords to filter:', keywords);
    if (keywords.length === 0) return;
    
    // 同时匹配推文和通知
    const elements = document.querySelectorAll('[data-testid="tweet"], [data-testid="notification"]');
    console.log('Found elements:', elements.length);
    
    elements.forEach(el => {
      const text = el.innerText.toLowerCase();
      const shouldHide = keywords.some(keyword => text.includes(keyword.toLowerCase()));
      if (shouldHide) {
        console.log('Hiding element:', text);
        el.style.display = 'none';
      }
    });
  });
}

// 初次执行过滤
filterContent();

// 监听页面变化，针对动态加载的内容进行过滤
const observer = new MutationObserver(() => {
  filterContent();
});
observer.observe(document.body, {childList: true, subtree: true});
