const Footer = () => (
  <footer>
    <p>
      <a href="https://twitter.com/aabilio">@aabilio</a>
    </p>

    <style jsx>
      {`
      footer {
        position: fixed;
        bottom: 0;
        left: 0;

        height: 30px;
        width: 100%;
        background: #ffc107;
      }
      footer p {
        margin: 0;
        padding: 0 10px;
        line-height: 30px;
        font-weight: bold;
        text-align: right;
      }
      footer p a {
        color: #ec407a;
      }  
    `}
    </style>
  </footer>
)

export default Footer
