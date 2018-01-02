location.hash = '/'

angular.module('app.routes', ['ui.router'])

.config(function($stateProvider){
    $stateProvider
    // console.log('test', $stateProvider.state.url)
        .state('home',{
            url: '/',
            views: {
                'main': {
                    templateUrl: '/public/templates/main.html'
                }
            }
        })

        .state('singleImage',{
            url: '/singleImage/:imageId',
            views: {
                'main': {
                    templateUrl: '/public/templates/singleImage.html'
                }
            }
        })

        .state('uploadImage',{
            url: '/uploadImage',
            views: {
                'main': {
                    templateUrl: '/public/templates/upload.html'
                }
            }
        })

        .state('imageMap',{
            url: '/imageMap',
            views: {
                'main': {
                    templateUrl: '/public/templates/imageMap.html'
                }
            }
        })

})

// .directive('getImageId', function(){
