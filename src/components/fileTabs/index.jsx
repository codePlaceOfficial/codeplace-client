import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from './DeleteIcon';
import "./index.scss"
const mockTabs = []
const fillMockTabs = () => {
    for (let i = 1; i <= 9; i++) {
        mockTabs.push({ __path: `/file${i}.txt`, name: `file${i}.txt` })
    }
}

export default function ScrollableTabsButtonForce() {
    const [value, setValue] = useState(0);
    const [tabs, setTabs] = useState(null);

    useEffect(() => {
        fillMockTabs();
        setTabs(mockTabs);
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='c_fileTabs_wrapper'>
            {tabs?.length > 0 ?  <Box sx={{ maxWidth: 480, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                >
                    {/* TODO 增加tab栈,删除一个就弹出上一个访问的tab，并且可以根据路径去搜索 */}
                    {tabs?.map(tab => {
                        return <Tab key={tab.__path} icon={<DeleteIcon onDelete={() => {
                            setTabs(tabs.filter((item, index) => {
                                if (item.__path !== tab.__path) return true;
                                else setValue(0);
                                return false;
                            }))
                        }} />} iconPosition="end" label={tab.name} />
                    })}
                </Tabs>
            </Box> : ""}

           
        </div>


    );
}
