export default class Customizator {
    constructor() {
        this.btnBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');
        this.clear = document.createElement('div');
        this.scale = localStorage.getItem('scale') || 1;
        this.color = localStorage.getItem('color') || '#ffffff';

        this.btnBlock.addEventListener('click', (e) => this.onScaleChange(e));
        this.colorPicker.addEventListener('input', (e) => this.onColorChange(e));
        this.clear.addEventListener('click', () => this.reset());
    }

    onScaleChange(e) {
        const body = document.querySelector('body'); //доступ ко всему элементу body
        if (e) {
            this.scale = +e.target.value.replace(/x/g, "");//значение по умолчанию (1 или 1,5) присваиваем scale
        }

        const recursy =(element) => {        //рекурсивная функция
            element.childNodes.forEach(node => {    // childNodes - дочерние элементы, которые содержит element и приходят они в виде массива
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0){
                    //В if мы задаём параметры поиска, а именно текстовый узел '#text' и проверки на
                    // удаление возможных пустых текстовых узлов, которые могут содержать как и пробелы и пустые строки, так и enter-ы.
                    
                    if (!node.parentNode.getAttribute('data-fz')) {
                        let value = window.getComputedStyle(node.parentNode, null).fontSize; // получаем fontsize parentNode.
                        // parentNode - это родитель, в данном случае, текстового узла. А родителем является тег, который его оборачивает (div, span и т.д.)

                        node.parentNode.setAttribute('data-fz', +value.replace(/px/g, ""))
                        // создаем кастомный аттрибут, в котором будем хранить данные о масштабе "по-умолчанию", чтобы мы могли вернуться к ниму

                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + "px";
                        // Логика такова, мы берем размер шрифта из элемента, умножаем на масштаб (который мы получили при клике на кнопку и прибавяем px, для того чтобы стили сработали)
                    } else {
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + "px";
                    }


                    
                } else {
                    recursy(node);  // Иначе, мы запускаем снова рекурсивную функцию, чтобы копать в глубь DOM - дерева.
                }
            })
        }

        recursy(body);

        localStorage.setItem('scale', this.scale);

    }

    onColorChange(e) {
        const body = document.querySelector('body');
        body.style.backgroundColor = e.target.value;
        localStorage.setItem('color', e.target.value);
    }

    setBgColor(){
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color;
        this.colorPicker.value = this.color;
    }

    injectStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            .panel {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: fixed;
                top: 10px;
                right: 0;
                border: 1px solid rgba(0,0,0, .2);
                box-shadow: 0 0 20px rgba(0,0,0, .5);
                width: 300px;
                height: 60px;
                background-color: #fff;
            
            }
            
            .scale {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100px;
                height: 40px;
            }

            .scale_btn {
                display: block;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(0,0,0, .2);
                border-radius: 4px;
                font-size: 18px;
            }
            
            .color {
                width: 40px;
                height: 40px;
            }

            .clear {
                font-size: 20px;
                cursor: pointer;
            }
        `;
        document.querySelector('head').appendChild(style);
    }

    reset() {
        localStorage.clear();
        this.scale = 1;
        this.color = '#ffffff';
        this.setBgColor();
        this.onScaleChange();
    }

    render() {
        this.injectStyle();
        this.setBgColor();
        this.onScaleChange();

        let scaleInputS = document.createElement('input'),
            scaleInputM = document.createElement('input'),
            panel = document.createElement('div');

        panel.append(this.btnBlock, this.colorPicker, this.clear);
        this.clear.innerHTML = "&times";
        this.clear.classList.add('clear');

        scaleInputS.classList.add('scale_btn');
        scaleInputM.classList.add('scale_btn');
        this.btnBlock.classList.add('scale');
        this.colorPicker.classList.add('color');

        scaleInputS.setAttribute('type', 'button');
        scaleInputM.setAttribute('type', 'button');
        scaleInputS.setAttribute('value', '1x');
        scaleInputM.setAttribute('value', '1.5x');
        this.colorPicker.setAttribute('type', 'color');
        this.colorPicker.setAttribute('value', '#ffffff');

        this.btnBlock.append(scaleInputS, scaleInputM);

        panel.classList.add('panel');
        document.querySelector('body').append(panel);

    }

}