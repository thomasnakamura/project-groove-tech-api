import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { uuid } from 'uuidv4'
import {AxiosRequestConfig} from 'axios'
import Redis from 'ioredis'



@Injectable()
export class CustomerService {

    private async getToken(): Promise <string> {
        const validationGroove = await axios.post('https://groove-signer.herokuapp.com/auth/login', {	
                username: 'groover',
                password: 'groove@tech'
          })
    return validationGroove.data.token 
    }


    async postCustomer(request): Promise<object> {
        const token = await this.getToken()
        const headerVerification: AxiosRequestConfig = { 
            headers: {'Authorization': `Bearer ${token}`}
        }
        
        const customerVerification = await axios.post('https://groove-signer.herokuapp.com/sign',  {	
                entity: {
                customer_key: request.customer_key,
                customer_name: request.customer_name
                }
        }, headerVerification) 
        const sign = customerVerification.data.signature


        const customer = {
            id: uuid(),
            customer_key: request.customer_key,
            customer_name: request.customer_name,
            signature: sign
            }

        const redis = new Redis()
        const cache = await redis.set(customer.id,JSON.stringify(customer))

        if(cache != 'OK'){
            throw new Error('Não há conexão com o cache')
        }
        

        return customer
    }
    async putCustomer(id,request): Promise<object> {

        const token = await this.getToken()
        const redis = new Redis()
        const cache = await redis.get(id)

        if(cache == null){
            throw new Error('Cliente não encontrado')
        }


        const headerVerification: AxiosRequestConfig = { 
            headers: {'Authorization': `Bearer ${token}`}
        }
        const customerVerification = await axios.post('https://groove-signer.herokuapp.com/sign',  {
            entity: 
            {
                customer_key: request.customer_key,
                customer_name: request.customer_name
            }
        },headerVerification)

        const sign = customerVerification.data.signature
      

        const customer = {

            id: id,
            customer_key: request.customer_key,
            customer_name: request.customer_name,
            signature: sign

        }

        const newCache = await redis.set(customer.id,JSON.stringify(customer)) 

        if(newCache != 'OK'){
            throw new Error('Não há conexão com o cache')
        }

        return customer
    }

    async getCustomer(id): Promise<object> {
        const redis = new Redis()
        const cache = await redis.get(id)
         if(cache == null){
            throw new Error('Cliente não encontrado')
        }

        return cache
    }
    

    
}
