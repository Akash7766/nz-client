import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import UseSlider from '../../../Hooks/UseSlider';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../../../Components/Spinner/Spinner';
const Slider = () => {
  const [image, setImage] = useState(null)
  const [sliderTitle, setSliderTitle] = useState('')
  const [load,setLoad]=useState(false)
  const [sliderDesc, setSliderDesc] = useState('')
  const imageInputRef = useRef();
  const [addBtnActive, setAddBtnActive] = useState(false)
  const { data:sliders, error, isError, isLoading:loading,refetch } = useQuery('sliders', async()=>{
    const { data } = await axios.get('http://localhost:5000/api/v1/slider')
    return data
})

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true)
    console.log(image)
    const formData = new FormData()
    formData.append('file', image)
    formData.append("upload_preset","NJ_images")
    formData.append("cloud_name","dvmwear6h")


    fetch("https://api.cloudinary.com/v1_1/dvmwear6h/image/upload",{
      method:"POST",
      body:formData
    })
    .then(res => res.json())
    .then(async data => {
        if(data.asset_id){
            const img = data.url
            const slider = {sliderTitle,sliderDesc,img}
            console.log(slider);
            const res =await axios.post("http://localhost:5000/api/v1/slider",slider)

            if(res){
                setLoad(false)
                refetch()
                if(res.data.success){
                  toast("slider Post added Successfull")

                }
            }
        }
    })
    .catch((err)=>{
        setLoad(false)
        console.log(err);
    })

    //clear all input field
    setSliderTitle('')

    setSliderDesc('')
    imageInputRef.current.value = "";
    setImage(null)


  }

  const deleteBlog = (id) => {
    setLoad(true)


    fetch(`http://localhost:5000/api/v1/slider/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(result => {
        if(result.success){
          setLoad(false)
          refetch()
          toast("slider deleted successfully")
      }

      })
  }

  if(load){
   return <Spinner/>
  }
  return (
    <div>

      <div className="container">

        <Button variant="primary" onClick={() => setAddBtnActive(!addBtnActive)}>
          add Slides
        </Button>
        <br />
        <br />

        <div className="">
          <div className={addBtnActive ? 'd-block' : 'd-none'}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3 ">
                <Form.Group className='col-6 sm-12' controlId="formGridName">
                  <Form.Label>Title</Form.Label>
                  <Form.Control value={sliderTitle} onChange={(e) => setSliderTitle(e.target.value)} required type="text" placeholder="Enter slider Title" />
                </Form.Group>



              </Row>

              <Form.Group className="mb-2 col-6 sm-12" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Descreption</Form.Label>
                <Form.Control
                  value={sliderDesc}
                  onChange={(e) => setSliderDesc(e.target.value)}
                  required as="textarea" rows={3}
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group className='col-4 sm-12' controlId="formGridState">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    ref={imageInputRef}
                    accept='image/*'
                    onChange={(e) => setImage(e.target.files[0])}

                    required type='file'
                  />
                </Form.Group>


              </Row>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>

          </div>
        </div>
        <br /><br />
        <div className="container blog-manage-section">
          <div className="container">
            {
              (sliders?.data?.length > 0) ? <Table responsive>
                <thead>
                  <tr>
                    <th>Id</th>


                    <th> Description</th>

                    <th> Action</th>

                  </tr>
                </thead>
                <tbody>
                  {
                    // eslint-disable-next-line jsx-a11y/alt-text
                    sliders?.data?.map((sld, index) => <tr key={index}><td>{index + 1}</td> <td> <img style={{ width: "40px", height: '35px' }} src={`${sld.img}`} /> <h5 className='p-2 d-inline'>{sld.sliderTitle}</h5></td> <td><Link to={`/dash-board/slider/update/${sld._id}`} className="btn btn-primary m-1" ><i class="bi bi-pencil-square"></i></Link>
                      <button className="btn btn-danger" onClick={() => deleteBlog(sld._id)}><i class="bi bi-trash-fill"></i></button></td></tr>)
                  }
                </tbody>
              </Table> : ''
            }


          </div>
        </div>
      </div>

    </div>
  )
}

export default Slider