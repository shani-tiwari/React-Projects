import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import Loading from './Loading';
import TopNav from './TopNav';
import DropDown from './DropDown';
import InfiniteScroll from 'react-infinite-scroll-component';
import VerticalCards  from './VerticalCards';

function People() {
    const navigate                = useNavigate();
    const [page, setPage]         = useState(1);
    const [person, setPerson]       = useState([]);
    const [category, setCategory] = useState('popular'); 
    const [HasMore, setHasMore]   = useState(true);
    // const [duration, setDuration] = useState("day");
    

    document.title = `shows App | Person Shows` ;


    const GetPerson = async() => {
        try {
            // shows only run on, Person or movie and not on all category. coz all can't be shows  obviouslyyyyyyy
          const {data} = await axios.get(`person/${category}?page=${page}`);
        //   setTrending(data.results);
        //   setTrending( (prev)=> [...prev, ...data.results] );
            
            if(data.results.length > 0){

                setPerson((prev) => [
                    ...prev, 
                    ...data.results,
                    // ...data.results.filter((item) => !prev.some((prevItem) => prevItem.id !== item.id))
                    // causing -> not loading data
                    // code auto changes page count on scroll, and then function called with next page, so new data every time...
                ]);   
                setPage(page + 1);
            }
            else{
                setHasMore(false);
            }

            // console.log(trending);
        } catch (error) {
          console.log(error); 
        }
      }


      const RefreshHandler = () => {
        if(person.length === 0) {GetPerson();}
        else {
            setPage(1);
            setPerson([]);
            GetPerson();
        }
      }

      useEffect(()=>{
        //  GetTrendingData();
           RefreshHandler();
      },[category] );



  return person.length > 0 ? 
    (
      <div className='w-screen p-[2%] select-none '>

          <div className='w-full flex justify-between '>

              {/* <Link onClick={()=> navigate(-1)}></Link> */}
              <h1 className='text-3xl text-zinc-300 font-semibold mt-2 border-b-2 '>
                  <i 
                   onClick={()=> navigate(-1)}
                   className=" text-zinc-300 text-3xl hover:text-[#6556CD] duration-300 ri-arrow-left-circle-line mr-4 shadow-white ">                    
                  </i>
                  person <sup className='text-xs text-zinc-500 '>({category})</sup>
              </h1>

              <div className='flex w-[70%] items-center m-0 z-20' >

                  <TopNav/>

                      {/*  array elems should be in lowercase, coz they will add in api to call and filter data */}
                  {/* <DropDown title={category} options={['on_the_air',, 'popular', 'top_rated', 'airing_today']} 
                   func={ (e)=> setCategory(e.target.value)}
                  /> */}

                  {/* <div className='w-[2%]'></div> */}

                  {/* <DropDown title="category" options={['day', "week"]} 
                   func={ (e)=> setDuration(e.target.value)}
                  /> */}
              </div>

          </div>


          <InfiniteScroll
           hasMore={HasMore}
           loader={ <Loading/>}
           next={GetPerson}
           dataLength={person.length}
          >
              {/* cards */}
              <VerticalCards data={person} title='people' />
          </InfiniteScroll>



      </div>

    ) : 
    ( <Loading/> )
}

export default People