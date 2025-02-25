import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function Home() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    async function fetchTools() {
      const { data } = await supabase.from('dd_tools').select('*');
      setTools(data);
    }
    fetchTools();
  }, []);

  return (
    <div>
      <h2>Top Domaining Tools</h2>
      {tools.map((tool) => (
        <div key={tool.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{tool.name}</h3>
          <p>{tool.description}</p>
          <a href={tool.link}>Visit Tool</a>
        </div>
      ))}
      <a href="/submit-tool">Add Your Tool</a>
    </div>
  );
}
export default Home;
