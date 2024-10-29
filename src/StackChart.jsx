import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StackChart({data, bar1Label, bar2Label}) {
    return (
        <ResponsiveContainer width="30%" height={200}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" stackId="a" fill="#8884d8" name={bar1Label} />
          <Bar dataKey="uv" stackId="a" fill="#82ca9d" name={bar2Label}/>
        </BarChart>
      </ResponsiveContainer>
    )
}