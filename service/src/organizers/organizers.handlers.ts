import { RequestHandler } from 'express-serve-static-core';
import Container from 'typedi';
import OrganizerService from './organizers.service';

export const getOrganizers: RequestHandler<
  never,
  { id: string; name: string }[],
  never
> = async (req, res) => {
  const organizerService = Container.get(OrganizerService);
  const organizers = await organizerService.getOrganizers();

  return res.json(organizers);
};
