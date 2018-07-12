import PropTypes from 'prop-types'

const Header = ({
  url, error, loading,
  handleInputChange,
  handleInputKeyPress,
  handelInputClick,
  handleShortClick,
}) => (
  <header>
    <p>Url shorter</p>
    <section className="shortener-app">
      <div className="input-container">
        <input
          type="text"
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onClick={handelInputClick}
          value={url}
          disabled={loading}
        />
        {(error)
          ? <p className="input__invalid-url">! Invalid url</p>
          : null
        }
      </div>
      <button
        type="button"
        className={loading ? 'button-loading' : null}
        onClick={handleShortClick}
      >
        {(loading)
          ? <span>LOADING</span>
          : <span>Short it!</span>
        }
      </button>
    </section>

    <style jsx>{`
      header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: black;
      } 
      header p {
        height: 30px;
        margin: 0;
        padding: 0 10px;
        line-height: 30px;
        background: #ffc107;
        color: #ec407a;
        font-weight: bold;
      }
      header .shortener-app {
        margin: 0;
        padding: 10px;
        height: 70px;
        /*
        border-bottom: 1px solid #ffc107;
        border-left: 1px solid #ffc107;
        border-right: 1px solid #ffc107;
        */
        background: rgba(255, 193, 7, 0.20);

        display: flex;  
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: space-between;
      }
      header .shortener-app > .input-container {
        margin-right: 12px;
        position: relative;

        display: flex;
        flex-grow: 1;
      }
      header .shortener-app > .input-container input {
        width: 100%;
        padding: 0 20px;
        line-height: 50px;
        border: 2px solid #ffeb3b;
        background: transparent;
        color: white;
        border-radius: 4px;
        font-size: 14px;
        flex-grow: 1;
      }
      header .shortener-app > .input-container > .input__invalid-url {
        position: absolute;
        background: rgba(255, 193, 7, 0.9);
        color: ##31707;
        border-radius: 2px;
        top: 20px;
        right: 20px;
      }
      header .shortener-app > input:hover {
        /* background: white; */
      }
      header .shortener-app > button {
        padding: 0;
        background: transparent;
        border: 2px solid #ffeb3b;
        color: #ffeb3b;
        border-radius: 4px;
        width: 94px;
        font-size: 14px;
        cursor: pointer;
        cursor: hand;
      }
      header .shortener-app > button.button-loading {
        background: #ed3f7a;
        color: #FFEB3B;
      }
      header .shortener-app > button:hover {
        background: #ffeb3b;
        color: black;
        border: 2px solid #ffc107;
      }
      header .shortener-app > button.button-loading:hover {
        background: #ed3f7a;
        color: #FFEB3B;
      }
    `}
    </style>
  </header>
)

Header.propTypes = {
  url: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleInputKeyPress: PropTypes.func.isRequired,
  handelInputClick: PropTypes.func.isRequired,
  handleShortClick: PropTypes.func.isRequired,
}

export default Header
