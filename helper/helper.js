exports.filterNullString = (value) => {
    return value
}

exports.filterWhiteSpace = (value) => {
    return value !== ' '
}

exports.argumentsFilterer = (args) => {
    var newArgs
    newArgs = args.filter(this.filterNullString)
    newArgs = newArgs.filter(this.filterWhiteSpace)
    newArgs.shift()
    return newArgs
}