(function() {
    'use strict';

    angular.module('myApp')
    .filter('customDateFilter',['$filter', function($filter){
        return function(input, type){
            //format of input : "2016-11-21"
            var todayDate = new Date();
            var today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
            // Yesterday
            var yesterdayDate = new Date();
            var dayOfMonth = yesterdayDate.getDate();
            yesterdayDate.setDate(dayOfMonth - 1);
            var yesterday = new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth(), yesterdayDate.getDate());
            //Tomorrow
            var tomorrowDate = new Date();
            dayOfMonth = tomorrowDate.getDate();
            tomorrowDate.setDate(dayOfMonth + 1);
            var tomorrow = new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate());
            
            var inputDate = new Date(input);
            var inputDateSpec = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
            // console.log('yesterday - ',yesterday);
            // console.log('tomorrow - ',tomorrow);
            // console.log('today - ',today);
            // console.log('inputDate - ',inputDateSpec);

            if (type == 'day'){
                if (inputDateSpec.getTime() == today.getTime()){    return 'Today'} // Today
                if (inputDateSpec.getTime() == yesterday.getTime()){    return 'Yesterday'} // Yesterday
                if (inputDateSpec.getTime() == tomorrow.getTime()){    return 'Tomorrow'} //Tomorrow
                return $filter('date')(input, 'EEEE');
            }
            if (type == 'date'){
                if (inputDateSpec.getTime() == today.getTime()){    return ''} // Today
                if (inputDateSpec.getTime() == yesterday.getTime()){    return ''} // Yesterday
                if (inputDateSpec.getTime() == tomorrow.getTime()){    return ''} //Tomorrow
                return $filter('date')(input, 'dd.MM.yyyy');
            }
        }
    }])
}());