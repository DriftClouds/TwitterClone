const site = "https://comp426fa19.cs.unc.edu/a09/tweets";
let id = 1000;
const TwitterAjax = {
    /**
     *
     * @returns {Promise<*[]>}
     */
    index(){
        return axios({
            method: "get",
            url: site,
            withCredentials: true
        }).then(({data}) => {
            return data;
        });
        // return Promise.resolve([
        //     {
        //         "id": 11,
        //         "type": "retweet",
        //         "body": "The force is strong in my family.",
        //         "parent": {
        //             "id": 4,
        //             "type": "tweet",
        //             "body": "May the force be with you.",
        //             "author": "Obi-Wan K.",
        //             "isMine": false,
        //             "isLiked": false,
        //             "retweetCount": 1,
        //             "replyCount": 2,
        //             "likeCount": 3,
        //             "someLikes": ["Yoda", "Rey", "Mace W."],
        //             "createdAt": 1565457409819,
        //             "updatedAt": 1565457409819
        //         },
        //         "parentId": 4,
        //         "author": "Luke 5.",
        //         "isMine": false,
        //         "isLiked": false,
        //         "retweetCount": 0,
        //         "replyCount": 0,
        //         "likeCount": 0,
        //         "someLikes": [],
        //         "createdAt": 1565457495114,
        //         "updatedAt": 1565457495114
        //     },
        //     {
        //         "id": 7,
        //         "type": "tweet",
        //         "body": "Now this is podracing",
        //         "author": "Anakin S.",
        //         "isMine": false,
        //         "isLiked": false,
        //         "retweetCount": 1,
        //         "replyCount": 2,
        //         "likeCount": 1,
        //         "someLikes": [ "Mace W."],
        //         "createdAt": 1565457409819,
        //         "updatedAt": 1565457409819
        // }]);
    },
    /**
     * create tweet
     * @param {string} comment
     */
    create(comment){
        return axios({
            method: "post",
            url: site,
            withCredentials: true,
            data: {
                body: comment
            }
        }).then(({data}) => {
            return data;
        });
        // return Promise.resolve({
        //     "id": id++,
        //     "type": "tweet",
        //     "body": comment,
        //     "author": "Han s.",
        //     "isMine": true,
        //     "isLiked": false,
        //     "retweetCount": 0,
        //     "replyCount": 0,
        //     "likeCount": 0,
        //     "someLikes": [],
        //     "createdAt": 1565533143707,
        //     "updatedAt": 1565533143707
        // });
    },
    /**
     * read tweet
     * @param {string | number} id
     */
    read(id){
        return axios({
            method: "get",
            url: site + '/' + id,
            withCredentials: true,
        }).then(({data}) => {
            return data;
        });
    },
    /**
     * update tweet
     * @param {string | number} id
     * @param {string} comment
     */
    update(id, comment){
        return axios({
            method: "put",
            url: site + '/' + id,
            withCredentials: true,
            data: {
                body: comment
            }
        }).then(({data}) => {
            return data;
        });
        // return Promise.resolve({
        //     "id": id,
        //     "type": "tweet",
        //     "body": comment,
        //     "author": "Han 5.",
        //     "isMine": true,
        //     "isLiked": false,
        //     "retweetCount": 0,
        //     "replyCount": 0,
        //     "likeCount": 0,
        //     "someLikes": [],
        //     "createdAt": 1565533143707,
        //     "updatedAt": 1565533143707
        // });
    },
    /**
     * delete my tweet
     * @param {string | number} id
     */
    destroy(id){
        return axios({
            method: "delete",
            url: site + '/' + id,
            withCredentials: true,
        }).then(({data}) => {
            return data;
        });
        // return Promise.resolve();
    },
    /**
     * like tweet
     * @param {string | number} id
     */
    like(id){
        return axios({
            method: "put",
            url: site + '/' + id + '/like',
            withCredentials: true,
        }).then(({data}) => {
            return data;
        });
        // return Promise.resolve();
    },
    /**
     * unlike tweet
     * @param {string | number} id
     */
    unlike(id){
        return axios({
            method: "put",
            url: site + '/' + id + '/unlike',
            withCredentials: true,
        }).then(({data}) => {
            return data;
        });
        // return Promise.resolve();
    },
    /**
     * @param {string | number} parentId
     * @param {string} comment
     */
    retweet(parentId, comment){
        return axios({
            method: "post",
            url: site,
            withCredentials: true,
            data: {
                type: "retweet",
                parent: parentId,
                body: comment
            }
        }).then(({data}) => data);
        // return Promise.resolve({
        //     "id": 19, "type": "retweet", "body": "My father had it, I have it, and my twin sister has it.", "parent": {
        //         "id": 11, "type": "tweet", "body": "The force is strong in my family.", "author": "Luke s.", "isMine": true, "isLiked": false, "retweetCount": 0, "replyCount": 0, "likeCount": 0, "someLikes": [], "createdAt": 1565457495114, "updatedAt": 1565457495114
        //     },
        //     "parentId": 11, "author": "Luke s.", "isMine": true, "isliked": false, "retweetCount": 0, "replyCount": 0, "likeCount": 0, "someLikes": [], "createdAt": 1565533143707, "updatedAt": 1565533432346
        // });
    },
    /**
     * @param {string | number} parentId
     * @param {string} comment
     */
    reply(parentId, comment){
        return axios({
            method: "post",
            url: site,
            withCredentials: true,
            data: {
                type: "reply",
                parent: parentId,
                body: comment
            }
        }).then(({data}) => data);
    }
};