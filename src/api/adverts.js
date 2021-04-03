import client from './client';
// import storage from '../utils/storage'

const advertsBaseUrl = '/api/v1';

export const getLatestAdverts = () => {
  const url = `${advertsBaseUrl}/adverts`;
  return client.get(url);
};

export const getAdvertDetail = advertId => {
  const url = `${advertsBaseUrl}/adverts/${advertId}`;
  return client.get(url);
};

export const createAdvert = advert => {
  const url = `${advertsBaseUrl}/adverts`;
  return client.post(url, advert);
};

export const deleteAdvert = advertId => {
  const url = `${advertsBaseUrl}/adverts/${advertId}`;
  return client.delete(url);
}

export const saveAd = advert => {

  const FD  = new FormData();

  for( const item in advert ) {
      FD.append( item, advert[ item ] );
  }

  const url = `${advertsBaseUrl}/adverts`;
  return client.post(url, FD);
}