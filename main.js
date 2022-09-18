(function () {
    // get elements;
    const tweetList = document.getElementById('tweetList'),
        tweetBtn = document.getElementById('tweetBtn'),
        input = document.getElementById('input'),
        loading = document.getElementById('loading'),
        editModal = document.getElementById('editModal'),
        newTweetBtn = document.getElementById('newTweetBtn'),
        closeBtn = document.getElementById('closeBtn');

    // tweet data
    let dataList = null,
        currentId = null;

    // Initialization interface
    refresh();

    // Listen for user input to change button state
    input.addEventListener("input", () => {
        tweetBtn.disabled = input.value.length === 0;
    });

    newTweetBtn.addEventListener("click", () => {
        currentId = null;
        input.value = '';
        showModal();
    });

    closeBtn.addEventListener("click", () => {
        hideModal();
    });

    // Listen for user clicks button to submit
    tweetBtn.addEventListener("click", () => {
        let value = input.value;
        if(value){
            showLoading();
            tweetBtn.disabled = true;
            input.value = '';

            new Promise((resolve, reject) => {
                if(currentId === null){
                    TwitterAjax.create(value).then((data) => {
                        if(Array.isArray(dataList)){
                            dataList.unshift(data);
                        }else {
                            dataList = [data];
                        }
                        resolve();
                    }).catch(reject);
                }else {
                    if(!Array.isArray(dataList)){
                        reject();
                        return ;
                    }
                    let index = dataList.findIndex(({id}) => id == currentId);
                    if(index !== -1){
                        TwitterAjax.update(currentId, value).then((data) => {
                            dataList[index] = data;
                            resolve();
                        }).catch(reject);
                    }else {
                        reject();
                    }
                }
            }).then(() => {
                tweetList.innerHTML = createHtmlByData(dataList);
            }).finally(() => {
                hideLoading();
                hideModal();
            });
        }
    });

    // listen user actions
    tweetList.addEventListener('click', (e) => {
        if(!Array.isArray(dataList)){
            return ;
        }
        let target = e.target,
            classList = target.classList,
            li = getItem(target),
            id = li ? li.dataset.id : null,
            index = dataList.findIndex((item) => id == item.id),
            itemData = dataList[index];

        if(!itemData){
            return ;
        }

        if(classList.contains('reply')){
            console.log("reply");
        }else if(classList.contains('retweet')) {
            TwitterAjax.retweet(id, '').then((data) => {
                dataList.unshift(data);
                tweetList.innerHTML = createHtmlByData(dataList);
            });
        }else if(classList.contains('like')) {
            let count = target.querySelector('.count'),
                likeCount = itemData.likeCount,
                like = classList.contains('link');

            like ? TwitterAjax.unlike(id) : TwitterAjax.like(id);
            itemData.likeCount = likeCount + (like ? -1 : 1);
            itemData.isLiked = !like;
            count.innerHTML = itemData.likeCount === 0 ? '' : itemData.likeCount;
            target.classList.toggle('link');
        }else if(classList.contains('delete')) {
            TwitterAjax.destroy(id).then(() => {
                dataList.splice(index, 1);
                tweetList.innerHTML = createHtmlByData(dataList);
            });
        }else if(classList.contains('edit')){
            currentId = id;
            input.value = itemData.body;
            showModal();
        }
    });

    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    function showModal() {
        editModal.style.display = 'block';
    }

    function hideModal() {
        editModal.style.display = 'none';
    }

    function refresh(){
        showLoading();
        TwitterAjax.index().then((data) => {
            dataList = data;
            tweetList.innerHTML = createHtmlByData(dataList);
        }).finally(() => {
            hideLoading();
        });
    }

    /**
     * get tweet item element
     * @param {HTMLElement} el
     * @returns {HTMLElement | null}
     */
    function getItem(el) {
        let target = el;
        while(target){
            if(target.classList.contains('item')){
                return target;
            }
            target = target.parentElement;
        }
        return null;
    }

    /**
     * create tweet list html
     * @param {{
     *     id: number,
     *     type: string,
     *     body: string,
     *     author: string,
     *     isMine: boolean,
     *     isLiked: boolean,
     *     retweetCount: number,
     *     replyCount: number,
     *     likeCount: number,
     *     someLikes: string[],
     *     createdAt: number,
     *     updatedAt: number,
     *     parentId: number,
     *     parent: object
     * }[]} data
     * @returns {string}
     */
    function createHtmlByData(data){
        if(!Array.isArray(data)){
            return '';
        }
        return data.map((item) => {
            return createItemByData(item);
        }).join('');
    }

    /**
     * create tweet item html
     * @param {{
     *     id: number,
     *     type: string,
     *     body: string,
     *     author: string,
     *     isMine: boolean,
     *     isLiked: boolean,
     *     retweetCount: number,
     *     replyCount: number,
     *     likeCount: number,
     *     someLikes: string[],
     *     createdAt: number,
     *     updatedAt: number,
     *     parentId: number,
     *     parent: object
     * }} data
     * @returns {string}
     */
    function createItemByData(data){
        let {id, author, createdAt, updatedAt, body, likeCount, replyCount, retweetCount, isMine, isLiked, type} = data;

        let time = new Date(updatedAt || createdAt).toLocaleString();

        return `
            <li class="item" data-id="${id}">
                <div class="item-header">
                    <span class="author">${author}</span>
                    ${type === 'tweet' ? '' : `<span class="label">${type}</span>`}
                    <span class="time">${time}</span>
                </div>
                <div class="item-body"><pre>${body}</pre></div>
                <div class="item-footer">
                    <a class="reply">reply <span class="count">${replyCount || ''}</span></a>
                    <a class="retweet">retweet <span class="count">${retweetCount || ''}</span></a>
                    <a class="like ${isLiked ? 'link' : ''}">like <span class="count">${likeCount || ''}</span></a>
                    ${isMine ? `
                    <a class="edit">edit</a>
                    <a class="delete">delete</a>
                    ` : ""}
                </div>
            </li>
        `;
    }
})();