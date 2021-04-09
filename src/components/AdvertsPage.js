import React from 'react';
import QueryForm from './QueryForm';
import Advert from './Advert';
import { getLatestAdverts } from '../api/adverts';
import storage from '../utils/storage';
import Loading from './Loading';
import MessagePage from './MessagePage';


const AdvertsPage = ({ me }) => {

  const cleanFilters = {
    id:'',
    nombre:'',
    precio:[0,5000],
    venta:'',
    tags:''
  };
  const [queries, setQueries] = React.useState(
     me ? JSON.parse(storage.get(me)) || cleanFilters :
      cleanFilters);

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
  const stop = () => {
    setIsLoading(false)
  };
  const anError = (error) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  }
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {

    getLatestAdverts().then(setAds).then(stop).catch(anError);

    if(me){
      if(storage.get(me)){
        setQueries(JSON.parse(storage.get(me.toString())));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);
 
  
  const filtered = ads.filter( ad => 
    ad.price >= queries.precio[0] &&
    (ad.price <= queries.precio[1] || (queries.precio[1]===5000 && ad.price>5000)) &&
    ad.name.toLowerCase().includes(queries.nombre.toLowerCase()) &&
    ((ad.sale.toString() === queries.venta ) || (queries.venta === '') ) &&
    ad.tags.filter(tag => queries.tags.includes(tag)).length === queries.tags.length
  );

  const adsElement = filtered.map( ad => {
    return <Advert ad={ad} queries={queries} key={ad.id}/>
  });

    if(error)
      return <div style={{color: 'white', backgroundColor:'red', padding: 10, borderRadius: '15px', width:'33vw', textAlign:'center', marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>Error: {error.message}</div>
    if(isLoading)
      return <Loading isLoading={true} />
    if(ads.length === 0)
      return <MessagePage
                message='There are no adverts yet'
                urlLink='/advert/new'
                textLink='Be the first creating one'
            />
    return <>
        {ads.length > 1 ? <QueryForm queries={queries} setQueries={setQueries} handleChange={handleChange} handleReset={handleReset}/> : ''}
        <div className='ads-list'>
          {adsElement.length !==0 ? 
          adsElement : 
          <MessagePage
            message='There are no adverts with this filter'
            urlLink='/advert/new'
            textLink='You can create one' 
          />}
        </div>
      </>;
  }

  
  
  export default AdvertsPage;