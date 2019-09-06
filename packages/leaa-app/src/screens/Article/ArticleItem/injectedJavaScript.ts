export default `
var a = document.getElementsByTagName('a');
    for(var i = 0; i < a.length; i++){
        a[i].onclick = function (event) {
            window.postMessage(this.href);
            event.preventDefault();
        }
    }
`;
