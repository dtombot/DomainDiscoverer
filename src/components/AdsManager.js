import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function AdsManager() {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({ tool_id: '', banner_url: '' });

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    const { data } = await supabase.from('dd_ads').select('*');
    setAds(data);
  }

  async function addAd() {
    await supabase.from('dd_ads').insert([newAd]);
    setNewAd({ tool_id: '', banner_url: '' });
    fetchAds();
  }

  return (
    <div>
      <h2>Manage Advertisements</h2>
      <input
        value={newAd.tool_id}
        onChange={(e) => setNewAd({ ...newAd, tool_id: e.target.value })}
        placeholder="Tool ID"
        type="number"
        style={{ display: 'block', margin: '10px 0' }}
      />
      <input
        value={newAd.banner_url}
        onChange={(e) => setNewAd({ ...newAd, banner_url: e.target.value })}
        placeholder="Banner URL"
        style={{ display: 'block', margin: '10px 0' }}
      />
      <button onClick={addAd}>Add Ad</button>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id}>Tool {ad.tool_id} - {ad.banner_url} ({ad.active ? 'Active' : 'Inactive'})</li>
        ))}
      </ul>
    </div>
  );
}
export default AdsManager;
