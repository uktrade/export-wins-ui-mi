module.exports = {
    removeDuplicates: function(globalHvcs) {
        let hvcs = [];
        Object.values(globalHvcs).forEach((val) =>
            hvcs.push(val)
        );
        let uniqueHvcs = hvcs.filter((hvc, index, self) =>
            index === self.findIndex((hvc2) => hvc.name === hvc2.name)
        );
        return uniqueHvcs;
    }
};