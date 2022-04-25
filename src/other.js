document.getElementById("input").addEventListener("keydown", function (e) {
    check(document.getElementById("input").value)
})
document.getElementById("input").addEventListener("change", function (e) {
    check(document.getElementById("input").value)
})
var value,maps
var url = 'http://47.95.220.254:7001'
// var url = 'http://localhost:7001'
function check(val) {
    var _val = val
    var checkVal = value.split(',')
    checkVal.forEach(ele=>{
        matchFn(val,ele).forEach(e=>{
            var reg = new RegExp(e[0],'g')
            _val = _val.replace(reg, '<span style="color: red">'+ maps.get(e[0]) + '</span>')
        })
    })
    document.getElementById("outPut").innerHTML = _val
}
var matchFn = (val,info) => {
    var reg = new RegExp(info,'g')
    // 匹配出所字段
    var matches = [...val.matchAll(reg)];
    var matchesKey = [];
    matches.forEach(item => {
        matchesKey.push(item);
    });
    return matchesKey;
};

window.onload = function (obj) {
    axios.post(url + '/getList', {
    }).then(function(res) {
        if (res.status == 200) {
            var list = JSON.parse(decode(res.data.data.list).slice(0, -6))

            value = list.map(ele=> ele.temp).join(',')
            maps = new Map()
            list.forEach(ele=> ele.rule && maps.set(ele.temp, ele.rule))
        }
    })
}

function decode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}