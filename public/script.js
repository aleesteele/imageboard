var imageboardApp = angular.module('imageboardApp', ['app.routes'])
// console.log('THIS IS IMAGEBOARDAPP', imageboardApp)

imageboardApp.controller('ImageBoardController', ($scope, $http) => {
    console.log('initializing imageboardApp controller')
    $http.get('/images').then((resp) => { //OHHHHHH!!!!!!!!!!
        $scope.images = resp.data; // console.log('THIS IS RESP', resp)
        console.log('THIS IS $SCOPE.IMAGES', $scope.images);
        console.log('THIS IS RESP.DATA', resp.data);
        // console.log('THIS IS $SCOPE.IMAGES[0]', $scope.images[0]);
        // var commentObj = resp.data[1];
        // console.log('this is commentobj', commentObj);
        // $scope.comments = commentObj;
        var imageObj = resp.data;
        // console.log('this is commentobj', commentObj);
        $scope.images = imageObj;
        $scope.limit = 6;
        $scope.loadMore = function() {
            $scope.limit = $scope.limit + 6;
        }
    })
})

imageboardApp.controller('uploadController', ($scope, $http, $state) => {
    console.log('initializing uploadController')
    $scope.file = {};
    $scope.username = "";
    $scope.title = "";
    $scope.description = "";
    $scope.submit = function() {
        const file = $('input[type="file"]').get(0).files[0];
        const title = $scope.title;
        const username = $scope.username;
        const description = $scope.description
        // console.log('running submit', title, username, description);
       var formData = new FormData()
            formData.append('file', file)
            formData.append('title', title)
            formData.append('username', username)
            formData.append('description', description)
        $http({
            url: '/upload',
            method: 'POST',
            data: formData,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(() => {
            console.log('did it upload?????? YES!!!');
            $state.reload();
        }).catch((err) => { console.log('ERR WITH HTTP', err); })
    }
})

imageboardApp.controller('singleImageController', ($scope, $http, $stateParams) => {
    console.log('initializing singleAppController')
    $http.get('/singleImage/' + $stateParams.imageId).then((resp) => { //get request to db
        $scope.image = resp.data[0][0];
    })
})

imageboardApp.controller('showCommentController', ($scope, $http, $stateParams) => {
    console.log('initializing showCommentController controller')
    $http.get('/singleImage/' + $stateParams.imageId).then((resp) => { //response
        // console.log('RESP FOR COMMENTS', resp)
        console.log('RESP.DATA FOR COMMENTS', resp.data[1])
        $scope.comments = resp.data[1];
        // console.log('trying stuff:', comments.image_id)
        // $scope.comment
        if (resp.data[1] === null) {
            $scope.comment = "";
        } else {
            var commentObj = resp.data[1];
            console.log('this is commentobj', commentObj);
            $scope.comments = commentObj;
            $scope.limit = 3;
            $scope.loadMore = function() {
                $scope.limit = $scope.limit + 3;
            }
        }
    })
})

imageboardApp.controller('addCommentController', ($scope, $http, $stateParams, $state) => {
    console.log('initializing addCommentController')
    $scope.username = "";
    $scope.comment = "";
    $scope.submit = function() {
        const imageId = $stateParams.imageId;
        const username = $scope.username;
        const comment = $scope.comment;
        console.log('imageId', imageId, 'username', username, 'comment', comment)
        $http({
            url: "/singleImage/" + $stateParams.imageId,
            method: "POST",
            data: {
                'imageId': imageId,
                'username': username,
                'comment': comment
            } //add to array of comments! --> auto update
        }).then((results) => {
            // console.log('RESULTS FOR SUBMITTING COMMENT', results, 'DATA FOR COMMENT', data)
            console.log('uploading comment???????? YES!!!')
            $state.reload();
            $scope.message = "Uploaded!";
        }).catch((err) => { console.log('ERR WITH HTTP', err); })
    }
})
