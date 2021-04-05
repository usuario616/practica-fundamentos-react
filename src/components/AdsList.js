import React from 'react';
import { AuthContextConsumer } from '../components/auth/context';
import QueryForm from './QueryForm';
import Advert from './Advert';
import { getLatestAdverts } from '../api/adverts';
import storage from '../utils/storage';

const AdsList = ({ queries, setQueries, me }) => {

  const handleChange = (event) => { 

    setQueries(oldValue => {
      const newValue = event.target ?
      {
        ...oldValue,
        [event.target.name]: event.target.value,
      } :
      {
        ...oldValue,
        tags: event.length ? event : ''
      }
      ;
      saveQueries(newValue);
        return newValue;
    });
  }

  const handleReset = () => {
    
      const cleanFilter = {
        id:'',
        nombre:'',
        precio:[0,5000],
        venta:'',
        tags:''
      };
      setQueries(cleanFilter);
    saveQueries(cleanFilter);

  }

  const saveQueries = (value) => {
    storage.set(me, value);
  }

  const [ads, setAds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const stop = ()=>{setIsLoading(false)}
  
  React.useEffect(() => {
    getLatestAdverts().then(setAds).then(stop);
    if(me){
      if(storage.get(me)){
        setQueries(JSON.parse(storage.get(me.toString())));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);
 
  
  const filtered = ads.filter( ad => 
    ad.price >= queries.precio[0] &&
    ad.price <= queries.precio[1] &&
    ad.name.toLowerCase().includes(queries.nombre.toLowerCase()) &&
    ((ad.sale.toString() === queries.venta ) || (queries.venta === '') ) &&
    ad.tags.filter(tag => queries.tags.includes(tag)).length === queries.tags.length
  );

  const adsElement = filtered.map( ad => {
    return <Advert ad={ad} queries={queries} key={ad.id}/>
  });

    if(isLoading)
      return <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;

    return <>
        <QueryForm queries={queries} setQueries={setQueries} handleChange={handleChange} handleReset={handleReset}/>
        <div className='ads-list'>
          {adsElement.length !==0 ? 
          adsElement : 
          <div style={{fontSize: 20, paddingTop:40, textAlign:'center'}}>No hay anuncios con ese filtro<br /><a href='/login'>Prueba a crear uno</a></div>}
        </div>
      </>;
  }

  const ConnectedAdsList = props => {
    return (
      <AuthContextConsumer>
        {value => {
          return (
            <AdsList
              me={value.profile ? value.profile.username : null}
              {...props}
            />
          );
        }}
      </AuthContextConsumer>
    );
  };
  
  export default ConnectedAdsList;