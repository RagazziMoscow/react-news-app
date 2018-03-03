window.emitter = new EventEmitter();


let myNews = [
    {
      author: 'Саша Печкин',
      text: 'В четверг, четвертого числа...',
      bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
      author: 'Просто Вася',
      text: 'Считаю, что $ должен стоить 35 рублей!',
      bigText: 'А евро 42!'
    },
    {
      author: 'Гость',
      text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
      bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

const Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
          author: React.PropTypes.string.isRequired,
          text: React.PropTypes.string.isRequired,
          bigText: React.PropTypes.string.isRequired
        })
    },
    readmoreClick(e) {
        e.preventDefault();
        this.setState({visible: true});
    },
    getInitialState() {
        return {
            visible: false
        }
    },
    render() {
        const author = this.props.data.author,
              text = this.props.data.text,
              bigText = this.props.data.bigText,
              visible = this.state.visible;

        return (
            <div className="article">
                <p class="news__author">{author}:</p>
                <p className={'news__text ' + (visible ? 'none': '')}>{text}</p>
                <a href="#"
                   onClick={this.readmoreClick}
                   className={'news__readmore ' + (visible ? 'none' : '')}>
                   Подробнее
                </a>
                <p className={'news__big-text ' + (visible ? '' : 'none')}>
                   {bigText}
                </p>
            </div>
        );
    }
});

const News = React.createClass({
    render() {
        const newsData = this.props.data;
        const newsTemplate = (newsData.length > 0) ?
            (newsData.map((item, index) => {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                );
            })) : (<p>К сожалению новостей нет</p>);

        return (
            <div className="news">
                {newsTemplate}
                <span className={'news-count ' + ((newsData.length > 0) ? '' : 'none') }>Всего новостей: {newsData.length}</span>
            </div>
        );
    }
});

const Add = React.createClass({
    getInitialState() {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        }
    },
    clickHandler() {
        const authorNode = ReactDOM.findDOMNode(this.refs.author);
        const textNode = ReactDOM.findDOMNode(this.refs.text);

        const bigText = textNode.value;
        const text = `${bigText.substring(0, 25)}...`;
        const article = {
            author: authorNode.value,
            text,
            bigText
        };
        window.emitter.emit('News.add', article);

        authorNode.value = '';
        textNode.value = '';
        this.setState({
            authorIsEmpty: true,
            textIsEmpty: true
        });
    },
    checkHandler() {
        const currentAgree = this.state.agreeNotChecked;
        this.setState({
            agreeNotChecked: !currentAgree,
        });
    },
    onFieldChange(propName, e) {
        const newValue = e.target.value;
        const propIsEmpty = (newValue.trim() === '');

        const nextState = {};
        nextState[propName] = propIsEmpty;

        this.setState(nextState)
    },
    render: function() {
      const myValue = this.state.myValue;
      return (
        <form className='add cf'>
        <input
          type='text'
          className='add__author'
          defaultValue=''
          placeholder='Ваше имя'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          ref='author'
        />
        <textarea
          className='add__text'
          defaultValue=''
          placeholder='Текст новости'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          ref='text'>
        </textarea>
        <label className='add__checkrule'>
          <input type='checkbox'
                 defaultChecked={false}
                 onChange={this.checkHandler} />
                 Я согласен с правилами
        </label>
        <button
          className='add__btn'
          onClick={this.clickHandler}
          disabled={this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty}>
          Добавить новость
        </button>
      </form>
      );
    }
  });
  
  const App = React.createClass({
    getInitialState() {
        return {
            news: myNews
        };
    },
    componentDidMount() {
        const that = this;
        window.emitter.addListener('News.add', (article) => {
            const nextNews = that.state.news;
            nextNews.unshift(article);
            
            that.setState({
                news: nextNews
            });
        });
    },
    componentWillUnmount() {
        window.emitter.removeListener('News.add');
    },
    render() {
        return (
         <div className="app">
            <h1>Новости</h1>
            <Add /> {/* добавили вывод компонента */}
            <News data={this.state.news} /> {/*комментарий в JSX*/}
         </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);