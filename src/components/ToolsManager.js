import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function ToolsManager() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetchTools();
  }, []);

  async function fetchTools() {
    const { data } = await supabase.from('dd_tools').select('*');
    setTools(data);
  }

  async function deleteTool(id) {
    await supabase.from('dd_tools').delete().eq('id', id);
    fetchTools();
  }

  return (
    <div>
      <h2>Manage Domain Tools</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            {tool.name} - <button onClick={() => deleteTool(tool.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ToolsManager;
