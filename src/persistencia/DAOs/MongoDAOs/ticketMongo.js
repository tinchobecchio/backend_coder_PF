import ticketModel from '../../models/Ticket.js'

export default class TicketManager {
  async findAll() {
    try {
      const tickets = await ticketModel.find()
      return tickets
    } catch (error) {
      return error
    }
  }

  async findOneByid(id) {
    try {
      const ticket = await ticketModel.findById(id)
      return ticket
    } catch (error) {
      return error
    }
  }

  async createOne(obj) {
    try {
      const ticket = await ticketModel.create(obj)
      return ticket
    } catch (error) {
      return error
    }
  }

  async updateOne(id, obj) {
    try {
      const updateTicket = await ticketModel.updateOne({ _id: id }, { $set: obj })
      return updateTicket
    } catch (error) {
      return error
    }
  }

  async deleteOne(id) {
    try {
      const deleteTicket = await ticketModel.deleteOne({ _id: id })
      return deleteTicket
    } catch (error) {
      return error
    }
  }
}

export const ticketManager = new TicketManager()