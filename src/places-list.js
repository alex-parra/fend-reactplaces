import _ from 'lodash'

export default _.orderBy([
  {name:'Ground Burger', lat:38.735519, lng:-9.154511},
  {name:'O Tacho', lat:38.734486, lng:-9.155158},
  {name:'Miradouro Pq. Eduardo VII', lat:38.730299, lng:-9.15443},
  {name:'Cinemateca', lat:38.720885, lng:-9.148749},
  {name:'Jardin Botânico', lat:38.718133, lng:-9.148729},
  {name:'Rest. Doca de Santo', lat:38.70064, lng:-9.176301},
], 'name')
