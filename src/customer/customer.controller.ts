import { Controller, Post, Body, Res, Put, Param, Get} from '@nestjs/common';
import {Response} from 'express'
import {CustomerService} from './customer.service'
import { isUuid } from 'uuidv4'


 

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post() 
        async postReciveCostumer(@Body() request: any, @Res() response: Response): Promise<object> {
            if(typeof request.customer_key != 'number' ){ 
                response.status(400).send('Customer_key precisa ser um número!')
            } else if(typeof request.customer_name != 'string' ){   
                response.status(400).send('Customer_key precisa ser um número!')
            } else {
                const postCustomer = await this.customerService.postCustomer(request)
                return response.status(200).send(postCustomer)
            }
        }
    @Put(':id')
        async putReciveCostumer(@Param('id') id, @Body() request: any, @Res() response: Response): Promise<any> {
        if(typeof request.customer_key != 'number' ){   
            response.status(400).send('Customer_key precisa ser um número!')
        } else if(typeof request.customer_name != 'string' ){   
            response.status(400).send('Customer_key precisa ser um número!')
        } else {
            if(!isUuid(id)){
                response.status(400).send("ID inválido")
            } else {
            const putCustomer = await this.customerService.putCustomer(id,request)
            return response.status(200).send(putCustomer)
            }
        }
    }
    @Get(':id')
    async getReciveCostumer(@Param('id') id,@Body() request: any, @Res() response: Response): Promise<object> {    
            try{
                const getCustomer = await this.customerService.getCustomer(id)
                return response.status(200).send(getCustomer)
            }catch(e){
                return response.status(404).send(e.message)
            }
            
        }
    
            
}
