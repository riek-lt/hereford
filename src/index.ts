import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton , QIcon } from '@nodegui/nodegui';
const fs  = require("fs");

const win = new QMainWindow();
win.setWindowTitle("Hello World");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Hello");

const label2 = new QLabel();
label2.setText("World");
label2.setInlineStyle(`
  color: red;
`);


const writeFileButton = new QPushButton();
writeFileButton.setText('Write to file');

writeFileButton.addEventListener('clicked', () => {
  console.log('aaaa');
});

const button2 = new QPushButton();
button2.setText('Click me');
button2.addEventListener('clicked', () => {
    console.log('the button was clicked');

    fs.writeFile('newfile.txt', 'Learn Node FS module',  (err: any) => {
      if (err) throw err;
      console.log('File is created successfully.');
    });

    fs.create
});



rootLayout.addWidget(label);
rootLayout.addWidget(label2);


rootLayout.addWidget(writeFileButton);
rootLayout.addWidget(button2);


win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
win.show();

(global as any).win = win;
