var status = false
var displacementAutoAsync = function(position, offset, backway, moveDelta) {
    if (!status) {
        new Promise((resolve, reject) => {
            moveDelta[position] = offset;
            status = true
            setTimeout(() => {
                resolve()
            }, 300);
        }).then(() => {
            moveDelta[position] = -offset;
            setTimeout(() => {
                moveDelta[position] = backway;
                status = false
            }, 300);
        })
    }
}
var displacementAsync = function(position, offset, moveDelta) {
    if (!status) {
        new Promise((resolve, reject) => {
            moveDelta[position] = offset;
            status = true
            setTimeout(() => {
                resolve()
            }, 300);
        }).then(() => {
            status = false
            moveDelta[position] = 0;
        })
    }
}

export default {
    displacementAutoAsync: displacementAutoAsync,
    displacementAsync: displacementAsync
}