function getUniqueHvcs(globalHvcs){
    let uniqueHvcs = [];
    Object.keys(globalHvcs).forEach(function (hvc) {
        let isDuplicate = false;
        uniqueHvcs.forEach(function (element) {
            if(hvc.name === element.name){
                isDuplicate = true;
            }
        });
        if(isDuplicate === false) {
            uniqueHvcs.push(hvc);
        }
    });
    return uniqueHvcs;
}

module.exports = {
	removeDuplicates: function (globalHvcs){
        let uniqueHvcs = getUniqueHvcs(globalHvcs);
        return uniqueHvcs;
    }
};
