/**
 * Created by vietdh on 10/15/2015.
 */

angular.module("cartModule", [])
    .factory("cart", function(){
        var cardData = [];
        return {
            addProduct : function(id, name, price){
                var addedToExistingItem = false;

                for(var i=0; i<cardData.length; i++){
                    if(cardData[i].id == id){
                        cardData[i].count++;
                        addedToExistingItem = true;
                        break;
                    }
                }

                if(!addedToExistingItem){
                    cardData.push({
                        count : 1,
                        id : id,
                        price : price,
                        name : name
                    });
                }
            },
            removeProduct : function(id){
                for(var i=0; i<=cardData.length; i++){
                    if(cardData[i].id == id){
                        cardData.splice(i, 1);
                        break;
                    }
                }
            },
            getProducts : function(){
                return cardData;
            }
        }
    }).directive("cartsSummary", function (cart) {
        return {
            restrict: "E",
            templateUrl: "components/cart/cartSummary.html",
            controller: function ($scope) {
                var cartData = cart.getProducts();
                $scope.total = function () {
                    var total = 0;
                    for (var i = 0; i < cartData.length; i++) {
                        total += (cartData[i].price * cartData[i].count);
                    }
                    return total;
                }
                $scope.itemCount = function () {
                    var total = 0;
                    for (var i = 0; i < cartData.length; i++) {
                        total += cartData[i].count;
                    }
                    return total;
                }
            }
        };
    });