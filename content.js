// 定义过滤函数，获取当前关键词列表后检查页面上所有推文
function filterTweets() {
    chrome.storage.sync.get({keywords: []}, (data) => {
      const keywords = data.keywords;
      console.log('Keywords to filter:', keywords);
      if (keywords.length === 0) return;
      
      // 修改选择器，匹配所有具有 data-testid="tweet" 的元素
      const tweets = document.querySelectorAll('[data-testid="tweet"]');
      console.log('Found tweets:', tweets.length);
      
      tweets.forEach(tweet => {
        const tweetText = tweet.innerText.toLowerCase();
        const shouldHide = keywords.some(keyword => tweetText.includes(keyword.toLowerCase()));
        if (shouldHide) {
          console.log('Hiding tweet:', tweetText);
          tweet.style.display = 'none';
        }
      });
    });
  }
  
  // 初次执行过滤
  filterTweets();
  
  // 监听页面变化，针对动态加载的推文进行过滤
  const observer = new MutationObserver(() => {
    filterTweets();
  });
  observer.observe(document.body, {childList: true, subtree: true});
  