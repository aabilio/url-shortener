import { PropTypes } from 'prop-types'

const UrlsList = ({ urls, lastAddedId }) => (
  <ul>
    {urls.map(shortUrl => (
      <li
        key={shortUrl.id}
        className={(lastAddedId === shortUrl.id) ? 'article__last-added' : null}
      >
        <article>
          <p className="article__url-id">{shortUrl.id}.</p>
          <p className="article__url-path"><a href={shortUrl.path}>/{shortUrl.path}</a></p>
          <p className="article__url-destination">{shortUrl.destination}</p>
          <p className="article__url-clicks">Clicks: <span>{shortUrl.clicks}</span></p>
        </article>
      </li>
    ))}

    <style jsx>{`
      ul {
        padding: 0;
        margin: 0;
      }
      li {
        background: black;
        padding: 5px 15px;
        border-bottom: 1px solid white;
        
        -webkit-transition: background-color 400ms linear;
        -moz-transition: background-color 400ms linear;
        -o-transition: background-color 400ms linear;
        -ms-transition: background-color 400ms linear;
        transition: background-color 400ms linear;
      }
      li.article__last-added {
        background: #4a148c;
      }
      article {
        height: 30px;
        width: 100%;
        padding: 0;

        display: flex;
        flex-direction: row;
        flex-wrap: stretch;
        align-items: center;
        justify-content: flex-start;
      }
      article p {
        color: white;
        height: 100%;
        margin: 0;
        padding: 0 5px;
        line-height: 30px;
        display: table-cell;
        vertical-align: middle;
      }
      article p.article__url-id {
        width: 40px;
        color: #ec407a;
        font-size: 14px;
      }
      article p.article__url-path {
        width: 12%;
        color: white;
        font-size: 14px;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
      }
      article p.article__url-path a {
        color: #ffc107;
      }
      article p.article__url-destination {
        width: 50%;
        color: white;
        font-size: 14px;
        flex-grow: 1;
        padding: 0 0 0 10px;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
      }
      article p.article__url-clicks {
        width: 100px;
        color: #ec407a;
        font-size: 14px;
        padding: 0 0 0 10px;
      }
      article p.article__url-clicks span {
        color: #ffeb3b;
      }
    `}
    </style>
  </ul>
)

UrlsList.propTypes = {
  urls: PropTypes.array.isRequired,
  lastAddedId: PropTypes.number,
}

UrlsList.defaultProps = {
  lastAddedId: null,
}

export default UrlsList
