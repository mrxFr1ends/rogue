function clearNode(parent) {
    while (parent.firstChild)
        parent.removeChild(parent.firstChild)
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}
Rect.prototype.intersect = function(other) {
    return (this.x <= other.x + other.width 
            && other.x <= this.x + this.width 
            && this.y <= other.y + other.height 
            && other.y <= this.y + this.height);
}