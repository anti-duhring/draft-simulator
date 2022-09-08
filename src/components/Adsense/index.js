import React from 'react';

export default class Adsense extends React.Component {
  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

render () {
    return (
        <ins className="adsbygoogle"
        style={{display: 'block', textAlign: 'center'}}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-5535142717283496"
        data-ad-slot="5190595118"></ins>
    );
  }
}